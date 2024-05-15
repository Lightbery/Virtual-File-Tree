import path from 'node:path'
import fs from 'node:fs'
import buffer from 'node:buffer'

// Virtual File Tree
export default class {
  private _fileTree: Folder = { type: 'folder', children: {} }

  // Load File Tree
  public loadFileTree (data: string): void {
    const json: { [key: string]: string } = JSON.parse(data)

    this._fileTree.children = {}

    Object.keys(json).forEach((virtualPath) => this.writeFile(virtualPath, buffer.Buffer.from(json[virtualPath], 'base64'), { recursive: true }))
  }

  // Save File Tree
  public saveFileTree (): string {
    const data: { [key: string]: string } = {}

    this.readFolder('', { recursive: true, fullPath: true, noFolder: true }).forEach((virtualPath) => {
      data[virtualPath] = this.readFile(virtualPath, { encoding: 'base64' })
    })

    return JSON.stringify(data)
  }
  
  // Create Folder
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

  // Write File
  public writeFile (virtualPath: string, data: buffer.Buffer, options?: { recursive?: boolean }): void {
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

  // Delete Folder Or File
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

  // Read Folder
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

  // Read File
  public readFile (virtualPath: string, options?: { encoding?: 'buffer' }): Buffer
  public readFile (virtualPath: string, options?: { encoding: 'utf8' | 'base64' | 'hex' }): string 
  public readFile (virtualPath: string, options?: { encoding?: 'buffer' | 'utf8' | 'base64' | 'hex' }): any {
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

    return (options.encoding === 'buffer' || options.encoding === undefined) ? data : data.toString(options.encoding)
  }

  // Exist
  public exist (virtualPath: string): boolean {
    let target = this._fileTree.children

    const splittedPath = virtualPath.split('/').filter((name) => name !== '')

    for (let folderName of splittedPath.slice(0, splittedPath.length - 1)) {
      if (target[folderName] === undefined || target[folderName].type === 'file') return false

      target = (target[folderName] as Folder).children
    }

    return target[splittedPath[splittedPath.length - 1]] !== undefined
  }

  // Get Stat
  public getStat (virtualPath: string): FolderStat | FileStat {
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

    if (target[fileName].type === 'folder') return { type: 'folder', childrens: this.readFolder(virtualPath, { recursive: true }).length } 
    else return { type: 'file', size: (target[fileName] as File).data.length }
  }

  // Load Folder From The Real File System
  public loadFolderFromFS (realPath: string, virtualPath: string, options?: { recursive?: boolean }): void {
    if (!fs.existsSync(realPath)) throw new Error(`"${realPath}" Not Found`)
    if (!fs.statSync(realPath).isDirectory()) throw new Error(`"${realPath}" Is Not A Folder`)

    this.createFolder(virtualPath, options)

    const splittedPath = virtualPath.split('/').filter((name) => name !== '')

    fs.readdirSync(realPath).forEach((fileName) => {
      const stat = fs.statSync(path.join(realPath, fileName))

      if (stat.isDirectory()) {
        this.createFolder(splittedPath.concat([fileName]).join('/'), options)

        this.loadFolderFromFS(path.join(realPath, fileName), splittedPath.concat([fileName]).join('/'), options)
      } else if (stat.isFile()) this.writeFile(splittedPath.concat([fileName]).join('/'), fs.readFileSync(path.join(realPath, fileName)), options)
    })
  }

  // Load File From The Real File System
  public loadFileFromFS (realPath: string, virtualPath: string, options?: { recursive?: boolean }): void {
    if (!fs.existsSync(realPath)) throw new Error(`"${realPath}" Not Found`)
    if (!fs.statSync(realPath).isFile()) throw new Error(`"${realPath}" Is Not A File`)

    this.writeFile(virtualPath, fs.readFileSync(realPath), options)
  }
}

// Folder 
interface Folder {
  type: 'folder',

  children: { [key: string]: Folder | File }
}

// File
interface File {
  type: 'file',

  data: buffer.Buffer
}

// Folder Stat
interface FolderStat {
  type: 'folder',

  childrens: number
}

// File Stat
interface FileStat {
  type: 'file',

  size: number
}
