import type { BuiltinArticleDef } from '@/types/article'

/**
 * 内置短文库数据
 * 用于中长句综合打字练习
 */
export const ESSAYS_DATA: BuiltinArticleDef[] = [
  {
    id: 'essay-zaochensuibiji',
    key: 'essay-zaochensuibiji',
    title: '晨跑随笔',
    description: '短文练习',
    getContent: () =>
      '清晨六点，街道还没有完全醒来。路边的早餐店刚升起热气，行道树上有零星的鸟鸣。我沿着河岸慢跑，呼吸在冷空气里变得清晰而有节奏。跑到第三公里时，太阳从楼群后面露出一角，水面被照得发亮。回程时我放慢脚步，听见自己的心跳逐渐平稳，也觉得这一天有了一个踏实的开始。',
  },
  {
    id: 'essay-beiyexinban',
    key: 'essay-beiyexinban',
    title: '雨夜书桌',
    description: '短文练习',
    getContent: () =>
      '窗外的雨下得很密，路灯把雨丝照成一层轻雾。屋里只开着台灯，桌面上摊着一本旧笔记。翻到空白页时，我听见雨点敲在玻璃上的节奏，忽然觉得很多急着完成的事，都可以先慢一点。写下当天最重要的三件小事，心里反而安定下来。',
  },
  {
    id: 'essay-ditiechenjian',
    key: 'essay-ditiechenjian',
    title: '地铁晨间',
    description: '短文练习',
    getContent: () =>
      '早高峰的车厢里，人群安静却匆忙。有人闭目养神，有人盯着手机屏幕，也有人在背单词。我抓着扶手，看见窗外站台一闪而过，像一页页快速翻动的日历。到站提示响起时，大家同时向前一步，那种默契像城市每天重复的呼吸。',
  },
  {
    id: 'essay-zhoumushichang',
    key: 'essay-zhoumushichang',
    title: '周末菜场',
    description: '短文练习',
    getContent: () =>
      '周末早晨的菜场最有烟火气。摊主们一边整理蔬菜一边招呼熟客，青菜上还带着细小的水珠。挑番茄时，旁边阿姨热心地教我分辨新鲜度。买完菜走出来，手里提着沉甸甸的袋子，心里却轻松，因为一顿家常饭已经有了确定的味道。',
  },
  {
    id: 'essay-taohuayuanji',
    key: 'essay-taohuayuanji',
    title: '桃花源记（节选）',
    description: '东晋·陶渊明',
    getContent: () =>
      '土地平旷，屋舍俨然，有良田美池桑竹之属。阡陌交通，鸡犬相闻。其中往来种作，男女衣着，悉如外人。黄发垂髫，并怡然自乐。',
  },
  {
    id: 'essay-yueyanglouji',
    key: 'essay-yueyanglouji',
    title: '岳阳楼记（节选）',
    description: '宋·范仲淹',
    getContent: () =>
      '不以物喜，不以己悲。居庙堂之高则忧其民，处江湖之远则忧其君。是进亦忧，退亦忧。然则何时而乐耶。其必曰先天下之忧而忧，后天下之乐而乐乎。',
  },
  {
    id: 'essay-zuiwengtingji',
    key: 'essay-zuiwengtingji',
    title: '醉翁亭记（节选）',
    description: '宋·欧阳修',
    getContent: () =>
      '环滁皆山也。其西南诸峰，林壑尤美。望之蔚然而深秀者，琅琊也。山行六七里，渐闻水声潺潺，而泻出于两峰之间者，酿泉也。',
  },
  {
    id: 'essay-loutingji',
    key: 'essay-loutingji',
    title: '陋室铭',
    description: '唐·刘禹锡',
    getContent: () =>
      '山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。',
  },
  {
    id: 'essay-ailianshuo',
    key: 'essay-ailianshuo',
    title: '爱莲说（节选）',
    description: '宋·周敦颐',
    getContent: () =>
      '予独爱莲之出淤泥而不染，濯清涟而不妖，中通外直，不蔓不枝，香远益清，亭亭净植，可远观而不可亵玩焉。',
  },
  {
    id: 'essay-lantingjixu',
    key: 'essay-lantingjixu',
    title: '兰亭集序（节选）',
    description: '东晋·王羲之',
    getContent: () =>
      '此地有崇山峻岭，茂林修竹。又有清流激湍，映带左右。引以为流觞曲水，列坐其次。虽无丝竹管弦之盛，一觞一咏，亦足以畅叙幽情。',
  },
  {
    id: 'essay-shishuo',
    key: 'essay-shishuo',
    title: '师说（节选）',
    description: '唐·韩愈',
    getContent: () =>
      '古之学者必有师。师者，所以传道受业解惑也。人非生而知之者，孰能无惑。惑而不从师，其为惑也，终不解矣。',
  },
  {
    id: 'essay-chushibiao',
    key: 'essay-chushibiao',
    title: '出师表（节选）',
    description: '三国·诸葛亮',
    getContent: () =>
      '先帝创业未半而中道崩殂，今天下三分，益州疲弊，此诚危急存亡之秋也。然侍卫之臣不懈于内，忠志之士忘身于外者，盖追先帝之殊遇，欲报之于陛下也。',
  },
  {
    id: 'essay-qianchibifu',
    key: 'essay-qianchibifu',
    title: '前赤壁赋（节选）',
    description: '宋·苏轼',
    getContent: () =>
      '清风徐来，水波不兴。举酒属客，诵明月之诗，歌窈窕之章。少焉，月出于东山之上，徘徊于斗牛之间。白露横江，水光接天。',
  },
  {
    id: 'essay-beiying',
    key: 'essay-beiying',
    title: '背影（节选）',
    description: '朱自清',
    getContent: () =>
      '我看见他戴着黑布小帽，穿着黑布大马褂，深青布棉袍，蹒跚地走到铁道边，慢慢探身下去。尚不大难，可是他穿过铁道，要爬上那边月台，就不容易了。',
  },
  {
    id: 'essay-chuntian',
    key: 'essay-chuntian',
    title: '春（节选）',
    description: '朱自清',
    getContent: () =>
      '盼望着，盼望着，东风来了，春天的脚步近了。一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸红起来了。',
  },
  {
    id: 'essay-congbaicaoyuan',
    key: 'essay-congbaicaoyuan',
    title: '从百草园到三味书屋（节选）',
    description: '鲁迅',
    getContent: () =>
      '不必说碧绿的菜畦，光滑的石井栏，高大的皂荚树，紫红的桑椹。也不必说鸣蝉在树叶里长吟，肥胖的黄蜂伏在菜花上，轻捷的叫天子忽然从草间直窜向云霄里去了。',
  },
  {
    id: 'essay-guxiang',
    key: 'essay-guxiang',
    title: '故乡（节选）',
    description: '鲁迅',
    getContent: () =>
      '时候既然是深冬，渐近故乡时，天气又阴晦了。冷风吹进船舱中，呜呜地响，从篷隙向外一望，苍黄的天底下，远近横着几个萧索的荒村，没有一些活气。',
  },
  {
    id: 'essay-jinan',
    key: 'essay-jinan',
    title: '济南的冬天（节选）',
    description: '老舍',
    getContent: () =>
      '对于一个在北平住惯的人，像我，冬天要是不刮风，便觉得是奇迹。济南的冬天是没有风声的。对于一个刚由伦敦回来的人，像我，冬天要能看得见日光，便觉得是怪事。',
  },
  {
    id: 'essay-xiaomazi',
    key: 'essay-xiaomazi',
    title: '想北平（节选）',
    description: '老舍',
    getContent: () =>
      '伦敦、巴黎、罗马与堪司坦丁堡，曾被称为欧洲的四大“历史的都城”。我知道一些伦敦的情形，巴黎与罗马只是到过而已。可是我敢说，我所爱的北平不在这些都城之下。',
  },
  {
    id: 'essay-xiaojuzai',
    key: 'essay-xiaojuzai',
    title: '小桔灯（节选）',
    description: '冰心',
    getContent: () =>
      '这朦胧的桔红的光，实在照不了多远，但这小姑娘的镇定、勇敢、乐观的精神鼓舞了我。我似乎觉得眼前有无限光明。',
  },
  {
    id: 'essay-qiutianhuainian',
    key: 'essay-qiutianhuainian',
    title: '秋天的怀念（节选）',
    description: '史铁生',
    getContent: () =>
      '双腿瘫痪后，我的脾气变得暴怒无常。望着望着天上北归的雁阵，我会突然把面前的玻璃砸碎。听着听着李谷一甜美的歌声，我会猛地把手边的东西摔向四周的墙壁。',
  },
  {
    id: 'essay-ditan',
    key: 'essay-ditan',
    title: '我与地坛（节选）',
    description: '史铁生',
    getContent: () =>
      '我常觉得这中间有着宿命的味道。仿佛这古园就是为了等我，而历尽沧桑在那儿等待了四百多年。它等待我出生，然后又等待我活到最狂妄的年龄上忽地残废了双腿。',
  },
  {
    id: 'essay-xingzhe',
    key: 'essay-xingzhe',
    title: '行者无疆（节选）',
    description: '余秋雨',
    getContent: () =>
      '真正的行走，不是地理的位移，而是心灵的迁徙。脚步丈量的是道路，目光触及的是风景，而思想面对的却是文明的层层回响。',
  },
]
