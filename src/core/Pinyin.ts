// 为了方便理解，对于下述概念统一在代码中使用全拼变量名
//
// * 拼音 - Pinyin / pinyin
// * 全拼 - Quanpin / quanpin

/** 全拼编码枚举 */
export enum Quanpin {
  // 单韵母
  a = 'a',
  o = 'o',
  e = 'e',
  i = 'i',
  u = 'u',
  v = 'v',

  // 复韵母
  ai = 'ai',
  ei = 'ei',
  ui = 'ui',
  ao = 'ao',
  ou = 'ou',
  iu = 'iu',
  ie = 'ie',
  ve = 've',
  er = 'er',
  an = 'an',
  en = 'en',
  in = 'in',
  un = 'un',
  vn = 'vn',
  ang = 'ang',
  eng = 'eng',
  ing = 'ing',
  ong = 'ong',

  // 声母
  b = 'b',
  p = 'p',
  m = 'm',
  f = 'f',
  d = 'd',
  t = 't',
  n = 'n',
  l = 'l',
  g = 'g',
  k = 'k',
  h = 'h',
  j = 'j',
  q = 'q',
  x = 'x',
  z = 'z',
  c = 'c',
  s = 's',
  zh = 'zh',
  ch = 'ch',
  sh = 'sh',
  r = 'r',
  y = 'y',
  w = 'w',

  // 整体认读音节
  zhi = 'zhi',
  chi = 'chi',
  shi = 'shi',
  ri = 'ri',
  zi = 'zi',
  ci = 'ci',
  si = 'si',
  yi = 'yi',
  wu = 'wu',
  yu = 'yu',
  ye = 'ye',
  yue = 'yue',
  yuan = 'yuan',
  yin = 'yin',
  yun = 'yun',
  ying = 'ying',
}
