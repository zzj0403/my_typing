import type { BuiltinArticleDef } from '@/types/article'

/**
 * 内置诗词库数据
 * 包含唐诗宋词精选，用于打字练习
 * 采用懒加载设计：元数据立即加载，内容按需获取
 */
export const POEMS_DATA: BuiltinArticleDef[] = [
  {
    id: 'poem-jingyesi',
    key: 'poem-jingyesi',
    title: '静夜思',
    description: '唐·李白',
    getContent: () => '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
  },
  {
    id: 'poem-chunxiao',
    key: 'poem-chunxiao',
    title: '春晓',
    description: '唐·孟浩然',
    getContent: () => '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
  },
  {
    id: 'poem-dengguanquelou',
    key: 'poem-dengguanquelou',
    title: '登鹳雀楼',
    description: '唐·王之涣',
    getContent: () => '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
  },
  {
    id: 'poem-lianpuzuoshi',
    key: 'poem-lianpuzuoshi',
    title: '悯农',
    description: '唐·李绅',
    getContent: () => '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。',
  },
  {
    id: 'poem-xiangsi',
    key: 'poem-xiangsi',
    title: '相思',
    description: '唐·王维',
    getContent: () => '红豆生南国，春来发几枝。愿君多采撷，此物最相思。',
  },
  {
    id: 'poem-yongxing',
    key: 'poem-yongxing',
    title: '咏鹅',
    description: '唐·骆宾王',
    getContent: () => '鹅鹅鹅，曲项向天歌。白毛浮绿水，红掌拨清波。',
  },
  {
    id: 'poem-yongliu',
    key: 'poem-yongliu',
    title: '咏柳',
    description: '唐·贺知章',
    getContent: () =>
      '碧玉妆成一树高，万条垂下绿丝绦。不知细叶谁裁出，二月春风似剪刀。',
  },
  {
    id: 'poem-huichongchunjiangwanjing',
    key: 'poem-huichongchunjiangwanjing',
    title: '惠崇春江晚景',
    description: '宋·苏轼',
    getContent: () =>
      '竹外桃花三两枝，春江水暖鸭先知。蒌蒿满地芦芽短，正是河豚欲上时。',
  },
  {
    id: 'poem-xiaochi',
    key: 'poem-xiaochi',
    title: '小池',
    description: '宋·杨万里',
    getContent: () =>
      '泉眼无声惜细流，树阴照水爱晴柔。小荷才露尖尖角，早有蜻蜓立上头。',
  },
  {
    id: 'poem-sushirenjie',
    key: 'poem-sushirenjie',
    title: '九月九日忆山东兄弟',
    description: '唐·王维',
    getContent: () =>
      '独在异乡为异客，每逢佳节倍思亲。遥知兄弟登高处，遍插茱萸少一人。',
  },
  {
    id: 'poem-songyuanchai',
    key: 'poem-songyuanchai',
    title: '送元二使安西',
    description: '唐·王维',
    getContent: () =>
      '渭城朝雨浥轻尘，客舍青青柳色新。劝君更尽一杯酒，西出阳关无故人。',
  },
  {
    id: 'poem-zaofabaishidi',
    key: 'poem-zaofabaishidi',
    title: '早发白帝城',
    description: '唐·李白',
    getContent: () =>
      '朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住，轻舟已过万重山。',
  },
  {
    id: 'poem-wanglushanpubu',
    key: 'poem-wanglushanpubu',
    title: '望庐山瀑布',
    description: '唐·李白',
    getContent: () =>
      '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
  },
  {
    id: 'poem-geshanpangxiangxing',
    key: 'poem-geshanpangxiangxing',
    title: '隔山相伴行',
    description: '唐·王勃',
    getContent: () =>
      '城阙辅三秦，风烟望五津。与君离别意，同是宦游人。',
  },
  {
    id: 'poem-chunwang',
    key: 'poem-chunwang',
    title: '春望',
    description: '唐·杜甫',
    getContent: () =>
      '国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。',
  },
  {
    id: 'poem-yueyuexiashanba',
    key: 'poem-yueyuexiashanba',
    title: '月夜下石壕',
    description: '唐·杜甫',
    getContent: () =>
      '好雨知时节，当春乃发生。随风潜入夜，润物细无声。',
  },
  {
    id: 'poem-jueju',
    key: 'poem-jueju',
    title: '绝句',
    description: '唐·杜甫',
    getContent: () =>
      '两个黄鹂鸣翠柳，一行白鹭上青天。窗含西岭千秋雪，门泊东吴万里船。',
  },
  {
    id: 'poem-fengqiaoyebo',
    key: 'poem-fengqiaoyebo',
    title: '枫桥夜泊',
    description: '唐·张继',
    getContent: () =>
      '月落乌啼霜满天，江枫渔火对愁眠。姑苏城外寒山寺，夜半钟声到客船。',
  },
  {
    id: 'poem-youzishu',
    key: 'poem-youzishu',
    title: '游子吟',
    description: '唐·孟郊',
    getContent: () =>
      '慈母手中线，游子身上衣。临行密密缝，意恐迟迟归。谁言寸草心，报得三春晖。',
  },
  {
    id: 'poem-jiangxue',
    key: 'poem-jiangxue',
    title: '江雪',
    description: '唐·柳宗元',
    getContent: () => '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。',
  },
  {
    id: 'poem-shanaju',
    key: 'poem-shanaju',
    title: '山居秋暝',
    description: '唐·王维',
    getContent: () =>
      '空山新雨后，天气晚来秋。明月松间照，清泉石上流。',
  },
  {
    id: 'poem-tiqulinbi',
    key: 'poem-tiqulinbi',
    title: '题西林壁',
    description: '宋·苏轼',
    getContent: () =>
      '横看成岭侧成峰，远近高低各不同。不识庐山真面目，只缘身在此山中。',
  },
  {
    id: 'poem-qianjiaoshi',
    key: 'poem-qianjiaoshi',
    title: '钱塘湖春行',
    description: '唐·白居易',
    getContent: () =>
      '孤山寺北贾亭西，水面初平云脚低。几处早莺争暖树，谁家新燕啄春泥。',
  },
  {
    id: 'poem-jiangnanchun',
    key: 'poem-jiangnanchun',
    title: '江南春',
    description: '唐·杜牧',
    getContent: () =>
      '千里莺啼绿映红，水村山郭酒旗风。南朝四百八十寺，多少楼台烟雨中。',
  },
  {
    id: 'poem-qingming',
    key: 'poem-qingming',
    title: '清明',
    description: '唐·杜牧',
    getContent: () =>
      '清明时节雨纷纷，路上行人欲断魂。借问酒家何处有，牧童遥指杏花村。',
  },
]
