import VirtualFileTree from '../../Virtual-File-Tree'

const FileTree = new VirtualFileTree()

FileTree.writeFile('Text.txt', Buffer.from('Hello World'))

console.log(FileTree.readFile('Text.txt'))
