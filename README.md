# Virtual File Tree
A tool for creating virtual file tree.

## Example
```ts
import VirtualFileTree from './Virtual-File-Tree'

const fileTree = new VirtualFileTree()

fileTree.createFolder('Test')
fileTree.writeFile('Test/A.txt', Buffer.from('hi'))
```

## Contents
* [VirtualFileTree](#virtualfiletree)
  * [loadFileTree()](#loadfiletree)
  * [saveFileTree()](#savefiletree)
  * [createFolder()](#createfolder)
  * [writeFile()](#writefile)
  * [readFolder()](#readfolder)
  * [readFile()](#readfile)
  * [exist()](#exist)
  * [getStat()](#getstat)
  * [loadFolderFromFS](#loadfolderfromfs)
  * [loadFileFromFS](#loadfilefromfs)
 
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

> `return <undefined>`

## saveFileTree()
```ts
.saveFileTree() // Save the file tree
```

> `return <string>` (A JSON string)

## createFolder()
```ts
.createFolder(<virtualPath>, <options>) // Create a folder
```
* `virtualPath <string>` | The path of the folder in the virtual file tree.
* `options <undefined | object>` | Options for creating the folder.
  * `recursive <boolean>` | If enable, it'll create the missing parent folders.
