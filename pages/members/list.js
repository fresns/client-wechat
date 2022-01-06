/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { getConfigItemValue } from '../../api/tool/replace-key'
import Api from '../../api/api'

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/handler/memberHandler'),
  ],
  data: {
    // 配置数据库中的请求体
    requestBody: null,
    // 当前页面数据
    members: [],
    // 下次请求时候的页码，初始值为 1
    page: 1,
    // 页面是否到底
    isReachBottom: false,
  },
  onLoad: async function () {
    this.data.requestBody = await getConfigItemValue('menu_member_list_config')
    await this._loadCurPageData()
  },
  _loadCurPageData: async function () {
    if (this.data.isReachBottom) {
      return
    }

    const resultRes = await Api.member.memberLists(Object.assign(this.data.requestBody || {}, {
      page: this.data.page,
    }))

    if (resultRes.code === 0) {
      const { pagination, list } = resultRes.data
      this.setData({
        members: this.data.members.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.current === pagination.lastPage,
      })
    }
  },

  onReachBottom: async function () {
    await this._loadCurPageData()
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: async function () {
    this.setData({
      members: [],
      page: 1,
      isReachBottom: false,
    })
    await this._loadCurPageData()
    wx.stopPullDownRefresh()
  },
  /** 右上角菜单-分享给好友 **/
  onShareAppMessage: function () {
    return {
      title: 'Fresns 成员',
    }
  },
  /** 右上角菜单-分享到朋友圈 **/
  onShareTimeline: function () {
    return {
      title: 'Fresns 成员',
    }
  },
})
