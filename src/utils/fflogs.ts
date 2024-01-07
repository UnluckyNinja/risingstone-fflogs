
const parser = new DOMParser()

const gameVersion5 = [
  { id: '38', name: "伊甸希望乐园：再生之章" },
  { id: '33', name: "伊甸希望乐园：共鸣之章" },
  { id: '29', name: "伊甸希望乐园：觉醒之章" },
  { id: '32', name: "绝境战（暗影之逆焰）" },
  { id: '30', name: "绝境战 (红莲之狂潮)" },
  { id: '37', name: "讨伐歼灭战 III：高难度" },
  { id: '34', name: "讨伐歼灭战 II：高难度" },
  { id: '28', name: "讨伐歼灭战 I：高难度" },
  { id: '36', name: "幻巧战" },
  { id: '27', name: "迷宫挑战(80级)" },
  { id: '40', name: "希望之炮台：“塔”" },
  { id: '35', name: "人偶军事基地" },
  { id: '31', name: "复制工厂废墟" },
  { id: '39', name: "女王古殿贡希尔德神庙" }
] as const

const gameVersion6 = [
  { id: '54', name: "万魔殿 荒天之狱" },
  { id: '49', name: "万魔殿 炼净之狱" },
  { id: '44', name: "万魔殿 边境之狱" },
  { id: '53', name: "欧米茄绝境验证战" },
  { id: '45', name: "幻想龙诗绝境战" },
  { id: '43', name: "绝境战（旧版本）" },
  { id: '55', name: "讨伐歼灭战 III：高难度" },
  { id: '50', name: "讨伐歼灭战：高难度 II" },
  { id: '42', name: "讨伐歼灭战：高难度 I" },
  { id: '46', name: "幻巧战" },
  { id: '51', name: "迷宫挑战（异闻）" },
  { id: '41', name: "迷宫挑战 (90级)" },
  { id: '52', name: "喜悦神域欧芙洛绪涅" },
  { id: '47', name: "灿烂神域阿格莱亚" },
  { id: '48', name: "女王古殿贡希尔德神庙" }
] as const

export const gameVersions = [
  { children: gameVersion6, name: '晓月之终途' },
  { children: gameVersion5, name: '暗影之逆焰' },
] as const

export function getLogsProfileURL(serverName: string, charName: string) {
  return `https://cn.fflogs.com/character/CN/${serverName}/${charName}`
}

export async function getCharacterID(serverName: string, charName: string) {
  const res = await GM.xmlHttpRequest({
    url: `https://cn.fflogs.com/character/CN/${serverName}/${charName}`,
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6,en-GB;q=0.5,ja;q=0.4",
      "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Microsoft Edge\";v=\"120\"",
      "origin": "https://cn.fflogs.com/",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1"
    },
    anonymous: true,
    "method": "GET",
  }).catch((e: any) => console.error(e));

  const text = res.responseText // await res.text()
  const match = text.match(/var characterID\s?=\s?(\d+);/)
  if (!match) {
    // no data
    return null;
  }
  return match[1]
}

export async function getCharacterLogsData(charID: string, zoneID: string, dpsType = 'rdps') {
  const res = await GM.xmlHttpRequest({
    url: `https://cn.fflogs.com/character/rankings-zone/${charID}/dps/3/${zoneID}/0/5000/0/-1/Any/rankings/0/0?dpstype=${dpsType}&class=Any`,
    "headers": {
      "accept": "text/html, */*; q=0.01",
      "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6,en-GB;q=0.5,ja;q=0.4",
      "origin": "https://cn.fflogs.com/",
      'referer': 'https://cn.fflogs.com/',
      "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Microsoft Edge\";v=\"120\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest"
    },
    anonymous: true,
    "method": "GET",
  }).catch((e: any) => console.error(e));

  const text = res.responseText // await res.text()
  const doc = parser.parseFromString(text, 'text/html')
  doc.querySelectorAll('a').forEach(ele=>{
    ele.onclick = null
    ele.style.pointerEvents = 'none'
  })

  const table = doc.querySelector('table[id]')
  if (!table) {
    // no data
    return null;
  }
  return table
}
// unusable, 401 error
export async function getCharacterRankings(charName: string, serverName: string, zoneID: string, dpsType = 'rdps') {
  const res = await GM.xmlHttpRequest({
    url: `https://www.fflogs.com:443/v1/rankings/character/${charName}/${serverName}/CN`,
    method: 'GET',
    responseType: 'json'
  }).catch((e: any) => console.error(e));

  return res.response
}