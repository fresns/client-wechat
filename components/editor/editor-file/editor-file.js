/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { callPageFunction } from '../../../util/callPageFunction'

Component({
  properties: {
    files: Array,
  },
  data: {
    imageFiles: [],
    videoFiles: [],
    audioFiles: [],
    docFiles: [],
    isShowActionModal: false,
    checkedFid: null,
  },
  methods: {
    attached: function () {
      const { files } = this.data
      this.splitFilesByType(files)
    },
    splitFilesByType: function (files) {
      // 1.图片 / 2.视频 / 3.音频 / 4.文档
      this.setData({
        imageFiles: files.filter(file => file.type === 1),
        videoFiles: files.filter(file => file.type === 2),
        audioFiles: files.filter(file => file.type === 3),
        docFiles: files.filter(file => file.type === 4),
      })
    },
    onClickFile: function (e) {
      this.setData({
        isShowActionModal: true,
        checkedFid:e.currentTarget.dataset?.file?.fid
      })
    },
    onClickCloseModal: function () {
      this.setData({ isShowActionModal: false })
    },
    onClickDelete: function () {
      callPageFunction('onRemovedFile', this.data.checkedFid)
    },
  },
  observers: {
    'files': function (newFiles) {
      this.splitFilesByType(newFiles)
    },
  },
})
