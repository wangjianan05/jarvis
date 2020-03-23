<!--
 * @Description: 主页
 * @Author: your name
 * @Date: 2019-07-16 18:21:04
 * @LastEditTime : 2020-01-17 14:33:01
 * @LastEditors  : Please set LastEditors
 -->
<template>
  <div class="body">
    <div class="table_body">
      <div class="menuCards">
        <ul class="feature-list">
          <li v-for="(card,idx) in cardsData" :key="idx">
            <router-link :to="card.url">
              <div class="card-box">
              <div class="icon-custom icon-c">
                <i :class="icon[idx].icon"></i>
              </div>
              <div class="column-title">{{card.name}}</div>
            </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      cardsData:[],
      icon:[{
        icon:'iconfont iconiconfontshanchu'
      },{
        icon:'iconfont icontianjia'
      },{
        icon:'iconfont icontianjia'
      },{
        icon:'iconfont icontianjia'
      },{
        icon:'iconfont icontianjia'
      }]
    }
  },


  computed: {},

  created () {
    this.getNav()
  },

  mounted () {

  },

  methods: {
    getNav(){
      let _this = this
      var obj = {
        params: {
        },
        url: this.$urlConfig.nav

      }
      this.$api.get(obj).then(function (res) {
        if (res.code === '0') {
          // _this.cardsData = res.data
          res.data.map(_this.forEac)
        }
      })
    },
    /**
     * @Description: 递归获取子集菜单
     * @Author: WangJiaNan
     * @Param: {params:obj} 菜单集合
     * @Date: 2019-06-20 17:28:15
     */
    forEac (item) {
      console.log(item)
      if (item.childMenu.length > 0) {
        item.childMenu.map(this.forEac)
      } else {
        if (item.name !== '首页') {
          this.cardsData.push({
            name: item.name,
            url: item.url,
            id: item.id,
          })
        }
      }
    },
    
  }
}

</script>
<style lang='stylus' scoped>
$white = #fff;
/*  ====== 字体大小 ====== */
fontSize(args)
  font-size args;
/*  ====== 圆角函数 ====== */
round-corners(round=4px)
  border-radius: round
/*  ====== 线性渐变函数 ====== */ 
linear-gradient()
  background: -o-linear-gradient(arguments); 
  background: -moz-linear-gradient(arguments);
  background: -webkit-linear-gradient(arguments); 
.body
  height 100%
  background: url(./../assets/index_bg.png);
  background-size: cover;
  padding 20px
  .table_body
    width calc(100% - 40px)
    display inline-block
    overflow hidden
    .box-card
      width 20%
      float left
      height 200px
    .menuCards
      background transparent;
      height calc(100vh - 114px)
      overflow-y scroll
      background-size cover
      .feature-list
        display flex
        justify-content flex-start
        flex-wrap: wrap;
        margin-left 20px
        margin-top 15px
        > li
            margin 10px
            width 550px
            height 247px
            round-corners()
            linear-gradient -180deg,rgba(153,172,210,1) 0%,rgba(92,108,144,1) 100%
            &:nth-of-type(8n+1)
              linear-gradient 45deg,rgba(12,107,188,1) 0%,rgba(7,143,211,1) 100%;
            &:nth-of-type(8n+2)
              linear-gradient 45deg,rgba(80,51,170,1) 0%,rgba(119,85,205,1) 100%;
            &:nth-of-type(8n+3)
              linear-gradient 45deg,rgba(0,139,162,1) 0%,rgba(2,168,188,1) 100%;
            &:nth-of-type(8n+4)
              linear-gradient 45deg,rgba(11,75,178,1) 0%,rgba(11,100,218,1) 100%;
            &:nth-of-type(8n+5)
              linear-gradient 45deg,rgba(184,93,72,1) 0%,rgba(228,109,71,1) 100%;
            &:nth-of-type(8n+6)
              linear-gradient 45deg,rgba(2,137,2,1) 0%,rgba(0,166,0,1) 100%;
            &:nth-of-type(8n+7)
              linear-gradient 45deg,rgba(24,115,235,1) 0%,rgba(30,145,244,1) 100%;
            &:nth-of-type(8n+8)
              linear-gradient 45deg,rgba(0,139,162,1) 0%,rgba(1,166,186,1) 100%;
            &:nth-of-type(3),&:nth-of-type(4),&:nth-of-type(6),&:nth-of-type(7),&:nth-of-type(11),&:nth-of-type(12),&:nth-of-type(13),&:nth-of-type(14)
              width 300px
            > a
              display block
              width 100%
              height 100%
              text-decoration none
            .card-box
              // background-image: url(./images/shadow_bg.png);
              height: 160px;
              background-position: calc(50% + 60px) 6px;
              background-repeat: no-repeat;
              background-size contain
              .icon-custom
                width 114px
                height 114px
                background rgba(255,255,255,0.6)
                round-corners(50%)
                text-align center
                line-height 114px
                margin 36px auto
                .iconfont,.icon-svg
                  color $white
                  font-size 56px
                  fill: currentColor;
                  width: 56px;
                  height: inherit;
              .column-title
                fontSize(26px)
                width 100%
                color $white
                line-height 37px
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;  
                text-align center
</style>
