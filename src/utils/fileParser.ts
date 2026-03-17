/**
 * 文件解析错误类型
 */
export class FileParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileParseError'
  }
}

/**
 * 检查文件是否为有效的 txt 文件
 * @param file File 对象
 * @returns 是否为有效的 txt 文件
 */
export function isValidTxtFile(file: File): boolean {
  const validExtensions = ['.txt']
  const fileName = file.name.toLowerCase()
  return validExtensions.some(ext => fileName.endsWith(ext))
}

/**
 * 解析 txt 文件内容
 * @param file File 对象
 * @returns Promise<string> 文件内容
 * @throws FileParseError 如果文件类型不支持或读取失败
 */
export function parseTxtFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // 验证文件类型
    if (!isValidTxtFile(file)) {
      reject(new FileParseError('不支持的文件类型，请上传 .txt 文件'))
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result as string
      if (typeof text === 'string') {
        resolve(text)
      } else {
        reject(new FileParseError('文件读取失败'))
      }
    }

    reader.onerror = () => {
      reject(new FileParseError('文件读取失败，请确保文件未损坏'))
    }

    // 关键：指定 UTF-8 编码处理中文
    reader.readAsText(file, 'UTF-8')
  })
}
