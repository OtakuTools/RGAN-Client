import { getStorageToken } from '@/api/storage'

export class QiniuModule {

  DOWNLOAD_URL : string = 'http://res.rgan.work/'
  token : any = null

  constructor () {

  }
  
  uploader (compressOptions : any, observer : any, putExtra : any, fileData : any, fileName? : string) {
    if (!this.token) {
      getStorageToken().then(res => {
        this.token = res.data
        let subscription : any = null
        window.qiniu.compressImage(fileData, compressOptions).then(() => {
          let defaultFileName = fileData.name
          let observable = window.qiniu.upload(fileData, fileName || defaultFileName, this.token, putExtra)
          // 上传开始
          subscription = observable.subscribe(observer) 
        }).catch(err => {
          // 终止上传
          subscription && subscription.unsubscribe()
        })
      })
    } else {
      let subscription : any = null
      window.qiniu.compressImage(fileData, compressOptions).then(() => {
        let defaultFileName = fileData.name
        let observable = window.qiniu.upload(fileData, fileName || defaultFileName, this.token, putExtra)
        // 上传开始
        subscription = observable.subscribe(observer) 
      })
    }
  }

  uploadFile (fileData : any, fileName? : string, observer?: any, compressOptions?: any, putExtra?: any) {
    let _putExtra = {
      fname: 'test',
      params: {},
      mimeType: null
    }
    let _compressOptions = {
      quality: 0.92,
      noCompressIfLarger: true
      // maxWidth: 1000,
      // maxHeight: 618
    }
    let _observer = {
      next: (res) => {
        observer.next(res)
      },
      error (err) {
        observer.error(err)
        
      },
      complete: (res) => {
        let srcUrl = this.DOWNLOAD_URL + res.key
        observer.complete(srcUrl, res)
      }
    }

    if (!!putExtra) {
      Object.assign(_putExtra, putExtra)
    }
    
    if (!!compressOptions) {
      Object.assign(_compressOptions, compressOptions)
    }

    if (!!fileName) {
      this.uploader(_compressOptions, _observer, _putExtra, fileData, fileName)
    } else {
      this.uploader(_compressOptions, _observer, _putExtra, fileData)
    }
  }
}