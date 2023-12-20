declare global {
  function GM_xmlhttpRequest(options: any): Promise
  const GM: any
}
export {}