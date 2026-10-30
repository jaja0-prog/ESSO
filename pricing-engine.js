/* ESSO: estimador financeiro baseado no modelo da planilha do proprietário.
   Taxas editáveis, não são uma consulta em tempo real ao marketplace. */
(function(global){
  'use strict';
  const bands = [
    {label:'Até R$ 8,99', min:.01, max:8.99, pct:20, fixed:0},
    {label:'R$ 9 a R$ 79,99', min:9, max:79.99, pct:20, fixed:4.5},
    {label:'R$ 80 a R$ 99,99', min:80, max:99.99, pct:14, fixed:16},
    {label:'R$ 100 a R$ 199,99', min:100, max:199.99, pct:14, fixed:20},
    {label:'R$ 200 ou mais', min:200, max:999999, pct:14, fixed:26}
  ];
  const defaults={
    market:'Shopee', name:'', cost:0, packaging:0, otherCost:0, taxPct:0,
    marginPct:8, account:'CPF', delivery:'Shopee Envios', voucher:0, shipExtra:0,
    cpfExtra:0, fixedOverride:'',
    shopeePct:[20,20,14,14,14],shopeeFixed:[0,4.5,16,20,26],
    listingType:'Clássico', mlPct:11.5, mlFixed:0, mlShip:0, mlOther:0,
    customPrice:false, testPrice:0
  };
  const n=x=>{if(x===null||x===undefined||x==='')return 0; const v=typeof x==='string'?Number(x.replace(',','.')):Number(x);return Number.isFinite(v)?v:0};
  const cents=x=>Math.round((x+Number.EPSILON)*100)/100;
  const ceilCents=x=>Math.ceil((x-1e-9)*100)/100;
  const cap=x=>Math.max(0,n(x));
  function shoFees(i,p,x){
    const percent=cap((x.shopeePct||defaults.shopeePct)[i])/100;
    const manual=x.fixedOverride!==''&&x.fixedOverride!==null&&x.fixedOverride!==undefined;
    const fixed=manual?cap(x.fixedOverride):i===0&&x.account==='CNPJ'?p*.5:cap((x.shopeeFixed||defaults.shopeeFixed)[i]);
    return {percent, fixed, cpf:cap(x.cpfExtra), freight:x.delivery==='Logística própria'?Math.min(cap(x.voucher)*.25,10):0};
  }
  function candidateForBand(i,x,base){
    const band=bands[i];
    if(i===0&&x.account!=='CNPJ'&&!(x.fixedOverride!==''&&x.fixedOverride!==null&&x.fixedOverride!==undefined))return null;
    const b=shoFees(i,0,x),dynamic=(i===0&&x.account==='CNPJ'&&(x.fixedOverride===''||x.fixedOverride===undefined||x.fixedOverride===null))?.5:0;
    const denom=1-b.percent-dynamic-cap(x.taxPct)/100-cap(x.marginPct)/100;
    if(denom<=0)return null;
    const min=i===1&&x.account==='CPF'&&cap(x.cpfExtra)>0?12:band.min;
    let price=ceilCents(Math.max(min,(base+b.fixed+b.cpf+b.freight)/denom));
    if(price>band.max || price<=0)return null;
    // Verificação com tarifas aplicadas ao preço final, em centavos.
    for(let k=0;k<5;k++){
      const fee=shoFees(i,price,x);
      const profit=price*(1-fee.percent-cap(x.taxPct)/100)-fee.fixed-fee.cpf-fee.freight-base;
      if(profit+0.000001 >= price*cap(x.marginPct)/100)break;
      price=cents(price+.01);
    }
    if(price>band.max)return null;
    return {price,index:i};
  }
  function calc(x){
    const cost=cap(x.cost),packing=cap(x.packaging),otherCost=cap(x.otherCost),tax=cap(x.taxPct)/100,margin=cap(x.marginPct)/100;
    const valid = cost>0 && margin<1 && tax<1;
    if(!valid)return {valid:false,error:cost<=0?'Preencha o custo do produto para calcular.':'Revise imposto ou margem (devem ser menores que 100%).'};
    if(x.market==='Mercado Livre'){
      const fee=cap(x.mlPct)/100, fixed=cap(x.mlFixed), ship=cap(x.mlShip), other=cap(x.mlOther);
      const den=1-fee-tax-margin;
      if(den<=0)return{valid:false,error:'Tarifa + imposto + margem devem somar menos de 100%.'};
      const price=ceilCents((cost+packing+otherCost+fixed+ship+other)/den);
      const applied=x.customPrice ? cap(x.testPrice) : price;
      if(applied<=0)return {valid:false,error:'Informe um preço de teste maior que zero.'};
      const feeValue=cents(applied*fee), taxValue=cents(applied*tax);
      const totalFees=cents(feeValue+taxValue+fixed+ship+other);
      const payout=cents(applied-totalFees),profit=cents(payout-cost-packing-otherCost);
      return{valid:true,price,applied,payout,profit,margin:applied?profit/applied*100:0,fees:totalFees,feeValue,taxValue,fixed,ship,other,cpf:0,freight:0,totalCost:cents(cost+packing+otherCost),band:'Tarifa informada',market:'Mercado Livre'};
    }
    const base=cost+packing+otherCost+cap(x.shipExtra);
    const possible=bands.map((_,i)=>candidateForBand(i,x,base)).filter(Boolean);
    if(!possible.length)return{valid:false,error:'Não foi possível formar preço com essas taxas/margem. Revise os valores ou a taxa fixa manual.'};
    const best=possible.reduce((a,b)=>b.price<a.price?b:a);
    const price=best.price,applied=x.customPrice?cap(x.testPrice):price;
    if(applied<=0)return{valid:false,error:'Informe um preço de teste maior que zero.'};
    let i=bands.findIndex(b=>applied>=b.min&&applied<=b.max);
    if(i<0)i=applied<9?0:4;
    const f=shoFees(i,applied,x);
    const feeValue=cents(applied*f.percent),taxValue=cents(applied*tax),fixed=cents(f.fixed);
    const totalFees=cents(feeValue+taxValue+fixed+f.cpf+f.freight);
    const payout=cents(applied-totalFees-cap(x.shipExtra));
    const profit=cents(payout-cost-packing-otherCost);
    return{valid:true,price,applied,payout,profit,margin:applied?profit/applied*100:0,fees:cents(totalFees+cap(x.shipExtra)),feeValue,taxValue,fixed,ship:cap(x.shipExtra),other:0,cpf:f.cpf,freight:f.freight,totalCost:cents(cost+packing+otherCost),band:bands[i].label,market:'Shopee'};
  }
  global.ESSO_PRICE={defaults,bands,calc};
})(window);
