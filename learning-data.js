// ESSO — Conteúdo da Escola (área Aprendizados > aba Aulas)
// Edite este arquivo para adicionar/trocar professores, vídeos e exercícios.
// videoId: quando confirmar o vídeo exato, cole aqui o ID do YouTube (ex.: 'dQw4w9WgXcQ').
// Enquanto estiver vazio, o botão "Abrir no YouTube" leva a uma busca pelo título indicado.
window.ESSO_LEARNING = {
  modules: [
    {
      id:'m1', num:1, title:'Mercado e produto', question:'O que vale a pena colocar na loja?',
      lessons:[
        {id:'m1l1', subject:'Geral', title:'Ainda não escolhi o produto', teacher:'Bruno de Oliveira', channel:'Ecommerce na Prática', videoTitle:'O que vender no e-commerce para começar?', videoId:null},
        {id:'m1l2', subject:'Geral', title:'Já escolhi e apareceu muita concorrência', teacher:'Ricco de Carvalho', channel:'YouTube', videoTitle:'Como lidar com a concorrência no e-commerce', videoId:null},
        {id:'m1l3', subject:'Geral', title:'Quero outras formas de apresentar a oferta', teacher:'Alex Moro', channel:'YouTube', videoTitle:'10 dicas para vender nos marketplaces', videoId:null, note:'Use a discussão sobre kits como ponto de partida para o exercício.'}
      ],
      read:{
        summary:'Antes de cadastrar qualquer coisa, vale olhar pra loja real: o que já vende, onde está a concorrência e se dá pra apresentar a oferta de outro jeito (kits, variações, combos).',
        steps:[
          'Se ainda não escolheu o produto: olhe o que já existe na loja e o que tem demanda comprovada antes de inventar algo novo.',
          'Se já escolheu e a concorrência é grande: identifique o que os concorrentes não estão fazendo bem (foto, prazo, kit, atendimento).',
          'Pense em formas diferentes de apresentar a mesma oferta: kit, combo, variação de cor/tamanho.'
        ]
      },
      apply:{text:'Abra três anúncios de uma lixeira de pia. Anote uma pergunta de comprador que ficou sem resposta. Se a dúvida for "cabe atrás da torneira?", transforme isso numa tarefa concreta para a aula de fotografia: medir a profundidade e mostrar onde a lixeira cabe.', route:'listings', label:'Abrir Anúncios'}
    },
    {
      id:'m2', num:2, title:'Cadastro, título e descrição', question:'Como transformo o produto num anúncio completo?',
      lessons:[
        {id:'m2l1', subject:'Shopee', title:'Primeiro cadastro na Shopee', teacher:'Ajuda Aí Shopee', channel:'YouTube', videoTitle:'Como fazer o cadastro de produto', videoId:null},
        {id:'m2l2', subject:'Mercado Livre', title:'Primeiro cadastro no Mercado Livre', teacher:'Mercado Livre', channel:'YouTube', videoTitle:'Como criar anúncio no Mercado Livre passo a passo', videoId:null, note:'Indicado para quem vende o mesmo produto nas duas plataformas.'},
        {id:'m2l3', subject:'Shopee', title:'Melhorar um título que já existe', teacher:'Ajuda Aí Shopee', channel:'YouTube', videoTitle:'Como montar o título', videoId:null},
        {id:'m2l4', subject:'Shopee', title:'Melhorar uma descrição que já existe', teacher:'Ajuda Aí Shopee', channel:'YouTube', videoTitle:'Como escrever a descrição', videoId:null}
      ],
      read:{
        summary:'O título é o que o comprador digita na busca, não um nome bonito. A descrição responde o que vem na embalagem e quais medidas estão confirmadas.',
        steps:[
          'Comece pelo que o comprador digitaria na busca. Compare "Lixeira linda top" com "Lixeira de Pia 2,8 L para Cozinha".',
          'Confira categoria, atributos, variações e estoque antes de publicar.',
          'Na descrição, responda: o que vem na embalagem? Quais medidas foram confirmadas de verdade?'
        ]
      },
      apply:{text:'Monte um rascunho da lixeira de pia de 2,8 L seguindo os três passos acima: título pela busca, atributos conferidos e descrição com embalagem e medidas.', route:'listings', label:'Abrir Anúncios'}
    },
    {
      id:'m3', num:3, title:'Foto, capa e galeria', question:'Qual foto faz o comprador entender o produto?',
      lessons:[
        {id:'m3l1', subject:'Geral', title:'Produzir as fotos em casa', teacher:'YouTube', channel:'YouTube', videoTitle:'Como fotografar seus produtos em casa para vender', videoId:null, note:'Ensina a trabalhar só com celular e recursos disponíveis em casa.'},
        {id:'m3l2', subject:'Shopee', title:'Escolher a capa depois de fotografar', teacher:'Ajuda Aí Shopee', channel:'YouTube', videoTitle:'Como criar uma imagem de capa', videoId:null, note:'O foco é reconhecer o produto e a primeira impressão do anúncio.'}
      ],
      read:{
        summary:'Padrão da equipe: cinco imagens de 1000×1000 por variação. A capa precisa ser reconhecida mesmo em miniatura.',
        steps:[
          'Monte a sequência: capa, uso na bancada, medidas confirmadas, outro ângulo, detalhe do acabamento.',
          'Adapte a capa às regras do marketplace escolhido.',
          'No Canva: duplique a página do padrão da equipe, troque a foto, exporte e confira a ordem.',
          'Teste simples: reduza a capa ao tamanho de miniatura e veja se outra pessoa reconhece o produto.'
        ]
      },
      apply:{text:'Para a lixeira, monte as cinco imagens no padrão (capa, uso na bancada, medidas, ângulo, acabamento) e rode o teste da miniatura antes de publicar.', route:'listings', label:'Abrir Anúncios'}
    },
    {
      id:'m4', num:4, title:'Preço e margem', question:'Vendi por R$ 50. Quanto dessa venda ficou comigo?',
      lessons:[
        {id:'m4l1', subject:'Geral', title:'Entender a conta pela primeira vez', teacher:'Sebrae', channel:'YouTube', videoTitle:'Como calcular o preço de venda', videoId:null},
        {id:'m4l2', subject:'Mercado Livre', title:'Acompanhar a aplicação no Mercado Livre', teacher:'Ecommerce na Prática', channel:'YouTube', videoTitle:'Precificação de produtos no Mercado Livre', videoId:null, start:380, note:'Capítulos: cálculo do preço em 6:20, margem de contribuição em 12:02. Confira as tarifas vigentes antes de usar os exemplos do vídeo.'}
      ],
      read:{
        summary:'Preço de venda não é custo + achismo. É custo + embalagem + tarifas + frete + margem real sobre o preço, não sobre o custo.',
        steps:[
          'Some custo do produto, embalagem e outros custos diretos.',
          'Acrescente tarifas do marketplace e frete pago pela loja, quando houver.',
          'Margem é lucro dividido pelo preço de venda — não é um "acréscimo" simples sobre o custo.'
        ]
      },
      apply:{text:'Abra a calculadora do ESSO e informe preço de venda, custo, embalagem, tarifas e frete. Veja quanto sobra antes dos anúncios e dos custos fixos — guarde esse número para a aula de ROAS.', route:'pricing', label:'Abrir Calculadora de preços'}
    },
    {
      id:'m5', num:5, title:'Shopee Ads e ROAS', question:'Gastei R$ 20 e apareceram R$ 100 em vendas. Foi bom?',
      teacherOpening:{teacher:'Edes', text:'Você gastou vinte reais em publicidade. O painel atribuiu cem reais em vendas à campanha. Antes de aumentar o orçamento, abre a calculadora comigo. Quanto sobrava desses cem reais antes de pagar o anúncio?'},
      lessons:[
        {id:'m5l1', subject:'Shopee', title:'Indicação do João', teacher:'Indicação pessoal', channel:'—', videoTitle:'Vídeo indicado pelo João (conferir autoria e trecho exato)', videoId:null, start:898, pending:true, note:'Conteúdo e autoria exatos deste trecho ainda precisam de conferência antes de divulgar o nome do professor.'},
        {id:'m5l2', subject:'Shopee', title:'Quero entender os nomes no painel', teacher:'Cauê Oliveira', channel:'YouTube', videoTitle:'ROAS e ACOS no Shopee Ads', videoId:null, start:865},
        {id:'m5l3', subject:'Shopee', title:'Quero outra explicação da conta', teacher:'YouTube', channel:'YouTube', videoTitle:'ROAS e ACOS explicados', videoId:null},
        {id:'m5l4', subject:'Shopee', title:'Quero decidir qual meta usar', teacher:'Cauê Oliveira', channel:'YouTube', videoTitle:'GMV Max e cálculo do ROAS mínimo', videoId:null, start:126, note:'Para configurar a campanha do zero, veja também "Como criar um anúncio de produto no Shopee Ads".'}
      ],
      read:{
        summary:'ROAS 5 quer dizer que cada R$1 de anúncio trouxe R$5 em vendas atribuídas — isso não é o mesmo que lucro. Antes de aumentar orçamento, calcule o que sobrava daquela venda antes do anúncio.',
        steps:[
          'Conta simples: R$ 100 ÷ R$ 20 = ROAS 5.',
          'Produto A: sobravam R$ 30 antes da publicidade e restaram R$ 10 depois de pagar o anúncio.',
          'Produto B: sobravam R$ 15 e faltaram R$ 5 — mesmo ROAS, resultado diferente.',
          'Nos dois casos, os custos fixos da loja ainda precisam ser cobertos com o que sobra.',
          'Refaça essa conta com um produto real da sua loja antes de decidir aumentar orçamento.'
        ]
      },
      apply:{text:'Pegue um produto seu com Ads ativo. Primeiro calcule o ROAS (vendas ÷ gasto). Depois abra a calculadora de preço desse produto e veja quanto sobrava antes de pagar o anúncio.', route:'pricing', label:'Abrir Calculadora de preços'}
    },
    {
      id:'m6', num:6, title:'Visibilidade e conversão', question:'Meu anúncio aparece, recebe clique ou vende?',
      lessons:[
        {id:'m6l1', subject:'Shopee', title:'Entender o painel de resultados', teacher:'Shopee Brasil', channel:'YouTube', videoTitle:'Como trazer resultados baseados em dados', videoId:null},
        {id:'m6l2', subject:'Shopee', title:'Investigar o tráfego pago', teacher:'YouTube', channel:'YouTube', videoTitle:'Entendendo as métricas do Shopee Ads', videoId:null, note:'Mesmo vídeo já usado no módulo de Ads.'}
      ],
      read:{
        summary:'O problema muda conforme o estágio: impressão, clique ou pedido. Cada estágio pede um teste diferente.',
        table:[
          {sinal:'Poucas impressões', teste:'Conferir se a variação tem estoque, se o anúncio está ativo e se categoria e título correspondem à busca.'},
          {sinal:'Muitas impressões e poucos cliques', teste:'Comparar a capa em miniatura com ofertas semelhantes; testar uma foto em que tamanho, cor e tipo de produto fiquem mais claros.'},
          {sinal:'Visitas e poucos pedidos', teste:'Conferir preço com frete, prazo e dúvidas recorrentes (ex.: profundidade da lixeira) e incluir essa informação na galeria.'}
        ],
        steps:['Escolha o caso que bate com o seu anúncio.','Registre a mudança feita, a data e o indicador que espera melhorar.','Compare períodos comparáveis — com poucas visitas ainda não dá pra tirar conclusão.']
      },
      apply:{text:'Identifique o estágio do seu anúncio (impressão, clique ou pedido), aplique o teste correspondente e registre a mudança como um novo teste no histórico do anúncio.', route:'listings', label:'Abrir Anúncios'}
    },
    {
      id:'m7', num:7, title:'Revisão antes de publicar', question:'O comprador vai receber exatamente o que entendeu?',
      lessons:[
        {id:'m7l1', subject:'Shopee', title:'Revisar a oferta antes de publicar', teacher:'Cadastro Campeão', channel:'YouTube', videoTitle:'Como evitar penalidades nos anúncios', videoId:null},
        {id:'m7l2', subject:'Shopee', title:'Corrigir uma descrição ambígua', teacher:'YouTube', channel:'YouTube', videoTitle:'Como criar uma descrição que ajuda a vender', videoId:null}
      ],
      read:{
        summary:'Antes de considerar o anúncio pronto, olhe pela perspectiva de quem só tem a foto e o título.',
        steps:[
          'Olhe a foto ambientada ao lado de um objeto comum (ex.: lixeira ao lado de uma esponja).',
          'Pergunte: pela foto e pelo título, dá pra saber o que vem no pacote?',
          'Confira capa, variações, quantidade e conteúdo da embalagem antes de publicar.'
        ]
      },
      apply:{text:'Escolha um anúncio seu e responda por escrito: alguém que só vê a capa e o título entenderia exatamente o que recebe? Ajuste o que faltar.', route:'listings', label:'Abrir Anúncios'}
    }
  ],
  doubts:[
    {question:'Como tirei tanta foto e ainda não tenho uma capa boa?', moduleId:'m3', lessonId:'m3l2'},
    {question:'Meu anúncio recebe visita, mas ninguém compra', moduleId:'m6', lessonId:'m6l1'},
    {question:'Meu ROAS deu 5. Posso aumentar o orçamento?', moduleId:'m5', lessonId:'m5l2'},
    {question:'Ainda não sei o que vender', moduleId:'m1', lessonId:'m1l1'},
    {question:'Meu título está fraco e ninguém acha meu anúncio', moduleId:'m2', lessonId:'m2l3'},
    {question:'Vendi, mas não sei se sobrou lucro de verdade', moduleId:'m4', lessonId:'m4l1'},
    {question:'Tenho medo de penalidade antes de publicar', moduleId:'m7', lessonId:'m7l1'}
  ]
};
