/** The virtual file tree itself */
export default class {
  private _fileTree: Folder = { type: 'folder', children: {} }

  /** Load the file tree */
  public loadFileTree (data: string): void {
    const json: { [key: string]: string } = JSON.parse(data)

    this._fileTree.children = {}

    Object.keys(json).forEach((virtualPath) => this.writeFile(virtualPath, this.base64ToBuffer(json[virtualPath]), { recursive: true }))
  }

  /** Save the file tree */ 
  public saveFileTree (): string {
    const data: { [key: string]: string } = {}

    this.readFolder('', { recursive: true, fullPath: true, noFolder: true }).forEach((virtualPath) => {
      data[virtualPath] = this.readFile(virtualPath, { encoding: 'base64' })
    })

    return JSON.stringify(data)
  }
  
  /** Create a folder */
  public createFolder (virtualPath: string, options?: { recursive?: boolean }): void {
    if (options === undefined) options = {}

    const currentPath: string[] = []

    let target = this._fileTree.children

    const splittedPath = virtualPath.split('/').filter((name) => name !== '')

    splittedPath.slice(0, splittedPath.length - 1).forEach((folderName) => {
      currentPath.push(folderName)

      if (target[folderName] === undefined) {
        if (options.recursive) target[folderName] = { type: 'folder', children: {} }
        else throw new Error(`"${currentPath.join('/')}" Not Found`)
      } else if (target[folderName].type === 'file') throw new Error(`"${currentPath.join('\n')}" Is Not A Folder`)

      target = (target[folderName] as Folder).children
    })

    target[splittedPath[splittedPath.length - 1]] = { type: 'folder', children: {} }
  }

  /** Write a file */ 
  public writeFile (virtualPath: string, data: ArrayBuffer, options?: { recursive?: boolean }): void {
    if (options === undefined) options = {}

    const currentPath: string[] = []

    let target = this._fileTree.children

    const splittedPath = virtualPath.split('/').filter((name) => name !== '')

    splittedPath.slice(0, splittedPath.length - 1).forEach((folderName) => {
      currentPath.push(folderName)

      if (target[folderName] === undefined) {
        if (options.recursive) target[folderName] = { type: 'folder', children: {} }
        else throw new Error(`"${currentPath.join('/')}" Not Found`)
      } else if (target[folderName].type === 'file') throw new Error(`"${currentPath.join('\n')}" Is Not A Folder`)

      target = (target[folderName] as Folder).children
    })

    target[splittedPath[splittedPath.length - 1]] = { type: 'file', data }
  }

  /** Delete a folder or file */
  public delete (virtualPath: string): void {
    const currentPath: string[] = []

    let target = this._fileTree.children

    const splittedPath = virtualPath.split('/').filter((name) => name !== '')

    splittedPath.slice(0, splittedPath.length - 1).forEach((folderName) => {
      currentPath.push(folderName)

      if (target[folderName] === undefined) throw new Error(`"${currentPath.join('/')}" Not Found`)
      if (target[folderName].type === 'file') throw new Error(`"${currentPath.join('/')}" Is Not A Folder`)

      target = (target[folderName] as Folder).children
    })

    delete target[splittedPath[splittedPath.length - 1]]
  }

  /** Read a folder */ 
  public readFolder (virtualPath: string, options?: { recursive?: boolean, fullPath?: boolean, noFolder?: boolean }): string[] {
    if (options === undefined) options = {}

    const currentPath: string[] = []

    let target = this._fileTree.children

    virtualPath.split('/').filter((name) => name !== '').forEach((folderName) => {
      currentPath.push(folderName)

      if (target[folderName] === undefined) throw new Error(`"${currentPath.join('/')}" Not Found`)
      if (target[folderName].type === 'file') throw new Error(`"${currentPath.join('/')}" Is Not A Folder`)

      target = (target[folderName] as Folder).children
    })

    let files: string[] = []

    Object.keys(target).forEach((fileName) => {
      if (!options.noFolder || target[fileName].type === 'file') files.push((options.fullPath) ? currentPath.concat(fileName).join('/') : fileName)

      if (options.recursive && target[fileName].type === 'folder') files = files.concat(this.readFolder(currentPath.concat(fileName).join('/'), options))
    })

    return files
  }

  /** Read a file  */ 
  public readFile (virtualPath: string, options?: { encoding?: 'buffer' }): ArrayBuffer 
  public readFile (virtualPath: string, options?: { encoding: 'utf8' | 'base64' }): string 
  public readFile (virtualPath: string, options?: { encoding?: 'buffer' | 'utf8' | 'base64' }): any {
    if (options === undefined) options = {}

    const currentPath: string[] = []

    let target = this._fileTree.children

    const splittedPath = virtualPath.split('/').filter((name) => name !== '')

    splittedPath.slice(0, splittedPath.length - 1).forEach((folderName) => {
      currentPath.push(folderName)

      if (target[folderName] === undefined) throw new Error(`"${currentPath.join('/')}" Not Found`)
      if (target[folderName].type === 'file') throw new Error(`"${currentPath.join('/')}" Is Not A Folder`)

      target = (target[folderName] as Folder).children
    })

    const fileName = splittedPath[splittedPath.length - 1]

    if (target[fileName] === undefined) throw new Error(`"${currentPath.concat([fileName]).join('/')}" Not Found`)
    if (target[fileName].type === 'folder') throw new Error(`"${currentPath.concat([fileName]).join('/')}" Is Not A File`)

    const data = (target[fileName] as File).data

    if (options.encoding === 'buffer' || options.encoding === undefined) return data
    else if (options.encoding === 'utf8') return new TextDecoder('utf-8').decode(data)
    else if (options.encoding === 'base64') return this.bufferToBase64(data)
  }

  /** Check if a path exist */ 
  public exist (virtualPath: string): boolean {
    if (virtualPath === '') return true

    let target = this._fileTree.children

    const splittedPath = virtualPath.split('/').filter((name) => name !== '')

    for (let folderName of splittedPath.slice(0, splittedPath.length - 1)) {
      if (target[folderName] === undefined || target[folderName].type === 'file') return false

      target = (target[folderName] as Folder).children
    }

    return target[splittedPath[splittedPath.length - 1]] !== undefined
  }

  /** Get the stat of a file */
  public getStats (virtualPath: string): FolderStats | FileStats {
    if (virtualPath === '') return { type: 'folder', children: this.readFolder('', { recursive: true }).length }

    const currentPath: string[] = []

    let target = this._fileTree.children

    const splittedPath = virtualPath.split('/').filter((name) => name !== '')

    splittedPath.slice(0, splittedPath.length - 1).forEach((folderName) => {
      currentPath.push(folderName)

      if (target[folderName] === undefined) throw new Error(`"${currentPath.join('/')}" Not Found`)
      if (target[folderName].type === 'file') throw new Error(`"${currentPath.join('/')}" Is Not A Folder`)

      target = (target[folderName] as Folder).children
    })

    const fileName = splittedPath[splittedPath.length - 1]

    if (target[fileName] === undefined) throw new Error(`"${currentPath.concat([fileName]).join('/')}" Not Found`)

    if (target[fileName].type === 'folder') return { type: 'folder', children: this.readFolder(virtualPath, { recursive: true }).length }
    else return { type: 'file', size: (target[fileName] as File).data.byteLength }
  }

  // Buffer To Base64
  public bufferToBase64 (buffer: ArrayBuffer): string {
    let string: string = ''

    for (let i = 0; i < buffer.byteLength; i++) string += String.fromCharCode(buffer[i])

    return string
  }

  // Base64 To Buffer 
  public base64ToBuffer (base64: string): ArrayBuffer {
    const buffer = new ArrayBuffer(base64.length)

    for (let i = 0; i < base64.length; i++) buffer[i] = base64.charCodeAt(i)

    return buffer
  }
}

/** A folder */
interface Folder {
  type: 'folder',

  children: { [key: string]: Folder | File }
}

/** A file */
interface File {
  type: 'file',

  data: ArrayBuffer 
}

/** A folder stats */
interface FolderStats {
  type: 'folder',

  children: number
}

/** A file stats */
interface FileStats {
  type: 'file',

  size: number
}
