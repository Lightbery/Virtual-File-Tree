# Virtual File Tree
A tool for creating virtual file tree.

## Example
```ts
import VirtualFileTree from './Virtual-File-Tree'

const fileTree = new VirtualFileTree()

fileTree.createFolder('Test')
fileTree.writeFile('Test/A.txt', Buffer.from('hi'))
```

## Installation
You can simply copy `Virtual-File-Tree.ts` into your project or use [JSR to install](https://jsr.io/@lightbery/virtual-file-tree).

## Contents
* [VirtualFileTree](#virtualfiletree)
  * [loadFileTree()](#loadfiletree)
  * [saveFileTree()](#savefiletree)
  * [createFolder()](#createfolder)
  * [writeFile()](#writefile)
  * [delete()](#delete)
  * [readFolder()](#readfolder)
  * [readFile()](#readfile)
  * [exist()](#exist)
  * [getStat()](#getstat)
  * [loadFolderFromFS()](#loadfolderfromfs)
  * [loadFileFromFS()](#loadfilefromfs)
* [FolderStat](#folderstat)
* [FileStat](#filestat)
 
# VirtualFileTree
```ts
import VirtualFileTree from './Virtual-File-Tree'

new VirtualFileTree() // Create a virtual file tree
```

## loadFileTree()
```ts
.loadFileTree(<data>) // Load the file tree
```
* `data <string>` | The source you want to load the file tree (should be the output of `.saveFileTree()`).

> `return <void>`

## saveFileTree()
```ts
.saveFileTree() // Save the file tree
```
> `return <void>` (A JSON string)

## createFolder()
```ts
.createFolder(<virtualPath>, <options>) // Create a folder
```
* `virtualPath <string>` | The path of the folder in the virtual file tree.
* `options <undefined | object>` | Options for creating the folder.
  * `recursive <boolean>` | If enable, it'll create the missing parent folders. `Default: false`

> `return <void>`

## writeFile()
```ts
.writeFile(<virtualPath>, <data>, <options>) // Write a file
```
* `virtualPath <string>` | The path of the file in the virtual file tree.
* `data <Buffer>` | The data you want to write.
* `options <undefined | object>` | Options for creating the file.
  * `recursive <boolean>` | If enable, it'll create the missing parent folders. `Default: false`

> `return <void>`

## delete()
```ts
.delete(<virtualPath>) // Delete a folder or file 
```
* `virtualPath <string>` | The path of the file in the virtual file tree.
* 
> `return <undefined>`
 
## readFolder()
```ts
.readFolder(<virtualPath>, <options>) // Read a folder
```
* `virtualPath <string>` | The path of the folder in the virtual file tree.
* `options <undefined | object>` | Options for reading the folder.
  * `recursive <boolean>` | Get all the children of the folder. `Default: false`
  * `fullPath <boolean>` | Get the full path of the files. `Default: false`
  * `noFolder <boolean>` | Filter out folders. `Default: false`

> `return <void>`

## readFile()
```ts
.readFile(<virtualPath>, <options>) // Read a file
```
* `virtualPath <string>` | The path of the file in the virtual file tree.
* `options <undefined | object>` | Options for reading the file.
  * `encoding <'buffer' | 'utf8' | 'base64' | 'hex'>` | The encoding of the data. `Default: 'buffer'`

> `return <void>`

## exist()
```ts
.exist(<virtualPath>) // Check if a path exist
```
* `virtualPath <string>` | The path of the file in the virtual file tree.

> `return <boolean>`

## getStats()
```ts
.getStats(<virtualPath>) // Get the stats of a file
```
* `virtualPath <string>` | The path of the file in the virtual file tree.

> `return <FolderStats | FileStats>`

## loadFolderFromFS()
```ts
.loadFolderFromFS(<realPath>, <virtualPath>, <options>) // Load folder from the real file system
```
* `realPath <string>` | The path of the folder you want to load from.
* `virtualPath <string>` | The path of the folder in the virtual file tree.
* `options <undefined | object>` | Options for reading the folder.
  * `recursive <boolean>` | If enable, it'll create the missing parent folders. `Default: false`

> `return <void>`

## loadFileFromFS()
```ts
.loadFileFromFS(<realPath>, <virtualPath>, <options>) // Load file from the real file system
```
* `realPath <string>` | The path of the file you want to load from.
* `virtualPath <string>` | The path of the file in the virtual file tree.
* `options <undefined | object>` | Options for reading the folder.
  * `recursive <boolean>` | If enable, it'll create the missing parent folders. `Default: false`

> `return <void>`

# FolderStats
```ts
interface FolderStats {
  type: 'folder',

  childrens: number
}
```

# FileStats
```ts
interface FolderStats {
  type: 'file',

  size: number
}
```
