const SET_FOLDERS = ['symbols-2','symbols-10','symbols-20']

export async function loadSetOptions() {
  const options = []
  
  for (const folderName of SET_FOLDERS) {
    try {
      const { default: config } = await import(`../assets/${folderName}/config.json`)
      options.push({
        ...config.metadata,
        folderName: folderName
      })
    } catch (error) {
      console.warn(`Failed to load config for ${folderName}:`, error)
    }
  }
  
  return options
}