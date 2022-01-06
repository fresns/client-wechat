/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api'
import { globalInfo } from '../../configs/fresnsGlobalInfo'

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/imageGallery'),
    require('../../mixin/loginInterceptor'),
    require('../../mixin/handler/commentHandler'),
  ],
  /** 页面数据 **/
  data: {
    // 配置数据库中的请求体
    requestBody: null,
    // 当前页面数据
    comments: [],
    // 下次请求时候的页码，初始值为 1
    page: 1,
    // 页面是否到底
    isReachBottom: false,
  },
  onLoad: async function (options) {
    this.setData({
      requestBody: null,
      comments: [],
      page: 1,
      isReachBottom: false,
    })
    await this._loadCurPageData()
  },
  _loadCurPageData: async function () {
    if (this.data.isReachBottom) {
      return
    }

    const resultRes = await Api.member.memberMarkLists({
      viewMid: globalInfo.currentMemberId,
      viewType: 1,
      viewTarget: 5,
      page: this.data.page,
    })

    if (resultRes.code === 0) {
      const { pagination, list } = resultRes.data
      this.setData({
        comments: this.data.comments.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.current === pagination.lastPage,
      })
    }
  },
  onReachBottom: async function () {
    await this._loadCurPageData()
  },
})
