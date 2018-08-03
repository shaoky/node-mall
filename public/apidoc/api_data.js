define({ "api": [
  {
    "type": "post",
    "url": "/",
    "title": "0. 商品表",
    "name": "goods",
    "group": "appGoodsGroup",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "goodsId",
            "description": "<p>商品id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "goodsSn",
            "description": "<p>商品编号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "goodsName",
            "description": "<p>商品名称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "goodsImageFull",
            "description": "<p>商品图片</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "goodsThumsFull",
            "description": "<p>商品缩略图</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "goodsImageBanner",
            "description": "<p>商品轮播图</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "goodsImageDetail",
            "description": "<p>商品详情图</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "marketPrice",
            "description": "<p>市场价</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "shopPrice",
            "description": "<p>商品价</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "goodsStock",
            "description": "<p>商品库存</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "goodsDesc",
            "description": "<p>商品详情</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "goodsStatus",
            "description": "<p>商品状态</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "createTime",
            "description": "<p>创建时间</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "saleTime",
            "description": "<p>上架时间</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isSale",
            "description": "<p>是否上架</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isNew",
            "description": "<p>是否新品商品</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isHot",
            "description": "<p>是否热卖商品</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isRecommend",
            "description": "<p>是否推荐商品</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "goodsFlag",
            "description": "<p>是否删除商品</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "order",
            "description": "<p>排序</p>"
          }
        ]
      }
    },
    "version": "1.0.0",
    "filename": "controller/app/goods/index.js",
    "groupTitle": "app-商品模块"
  },
  {
    "type": "post",
    "url": "/goodsAll/list",
    "title": "3. 全部商品",
    "name": "goodsAllList",
    "group": "appGoodsGroup",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "goodsName",
            "description": "<p>商品名称</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>商品列表，见商品表</p>"
          }
        ]
      }
    },
    "version": "1.0.0",
    "filename": "controller/app/goods/index.js",
    "groupTitle": "app-商品模块"
  },
  {
    "type": "post",
    "url": "/goodsCategory/list",
    "title": "4. 商品类别",
    "name": "goodsCategoryList",
    "group": "appGoodsGroup",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>主键</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "categoryName",
            "description": "<p>类别名称</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "children",
            "description": "<p>下级</p>"
          }
        ]
      }
    },
    "version": "1.0.0",
    "filename": "controller/app/goods/index.js",
    "groupTitle": "app-商品模块"
  },
  {
    "type": "post",
    "url": "/goods/info",
    "title": "2. 商品详情",
    "name": "info",
    "group": "appGoodsGroup",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "goodsId",
            "description": "<p>产品id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>商品详情，见商品表</p>"
          }
        ]
      }
    },
    "version": "1.0.0",
    "filename": "controller/app/goods/index.js",
    "groupTitle": "app-商品模块"
  },
  {
    "type": "post",
    "url": "/goods/list",
    "title": "1. 商品列表",
    "name": "list",
    "group": "appGoodsGroup",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "defaultValue": "0",
            "description": "<p>页码</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "size",
            "defaultValue": "20",
            "description": "<p>数量</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>商品列表，见商品表</p>"
          }
        ]
      }
    },
    "version": "1.0.0",
    "filename": "controller/app/goods/index.js",
    "groupTitle": "app-商品模块"
  },
  {
    "type": "post",
    "url": "/order/goodsPriview",
    "title": "1. 产品详情进入订单预览",
    "name": "goodsPriview",
    "group": "appOrderGroup",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "goodsId",
            "description": "<p>产品id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "goodsNum",
            "description": "<p>产品数量</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "goodsList",
            "description": "<p>见商品表</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "totalMoney",
            "description": "<p>商品总金额</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "payMoney",
            "description": "<p>支付金额</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "deliverMoney",
            "description": "<p>运费</p>"
          }
        ]
      }
    },
    "version": "1.0.0",
    "filename": "controller/app/order/index.js",
    "groupTitle": "app-订单模块"
  },
  {
    "type": "post",
    "url": "/",
    "title": "0. 订单表",
    "name": "order",
    "group": "appOrderGroup",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "orderId",
            "description": "<p>订单id</p>"
          }
        ]
      }
    },
    "version": "1.0.0",
    "filename": "controller/app/order/index.js",
    "groupTitle": "app-订单模块"
  }
] });
