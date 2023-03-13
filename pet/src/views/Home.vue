<template>
  <div class="animated animate__fadeIn">
    <!-- 轮播 -->
    <div class="carousel" style="">
      <el-carousel height="500px" :interval="5000" autoplay indicator-position="outside">
        <el-carousel-item v-for="(item, index) in swiperList" :key="index">
          <img :src="item.url">
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 产品特性 -->
    <div id="feather" class="container clearfix">
      <div>
        <h1>领养宠物 带它回家</h1>
        <p>乐宠服务平台对用户提供宠物领养服务，用户可以在这里仔细挑选，
          选出想带回家的小宝贝，为这些宝贝们提供一个温暖的家。
        </p>
      </div>
      <div>
        <h1>多样服务 任您挑选</h1>
        <p>乐宠服务平台提供多种宠物服务，宠物美容、宠物洗澡、宠物寄养、
          宠物医疗、宠物摄影等等，用户可以根据自己的需求选择服务。
        </p>
      </div>
      <div>
        <h1>宠物救助 刻不容缓</h1>
        <p>用户可以向平台提供救助信息，平台会第一时间派出救援队进行搜救，
          救援队具有专业的救援技能，可以在最短的时间内救出宠物。
        </p>
      </div>
    </div>
    <!-- 产品展示 -->
    <div id="ourproducts" class="container">
      <div class="title">
        <div>
          产品展示
          <small>OUR PRODUCTS</small>
        </div>
      </div>
      <div class="content clearfix">
        <div class="left fl clearfix">
          <div>
            <a href="#"><img src="images/pic01.jpg" alt=""></a>
            <a href="#"><img src="images/pic01-01.jpg" alt="" class="active"></a>
          </div>
          <div>
            <a href="#"><img src="images/pic02.jpg" alt=""></a>
            <a href="#"><img src="images/pic02-01.jpg" alt="" class="active"></a>
          </div>
          <div>
            <a href="#"><img src="images/pic03.jpg" alt=""></a>
            <a href="#"><img src="images/pic03-01.jpg" alt="" class="active"></a>
          </div>
          <div>
            <a href="#"><img src="images/pic04.jpg" alt=""></a>
            <a href="#"><img src="images/pic04-01.jpg" alt="" class="active"></a>
          </div>
        </div>
        <div class="right fl">
          <a href="#"><img src="images/pic05.jpg" alt=""></a>
          <a href="#"><img src="images/pic05-01.jpg" alt="" class="active"></a>
        </div>
      </div>
    </div>
    <!-- 关于我们 -->
    <div id="aboutUs">
      <div>
        <h1>关于我们</h1>
        <p>
          达瓦达瓦达瓦达瓦大大方便发一本v被告
          大方便发一本v被告大方便发一本v被告大方便发一本v被告
          大方便发一本v被告大方便发一本v被告大方便发一本v被告大方便发一本v被告
          大方便发一本v被告大方便发一本v被告大方便发一本v被告大方便发一本v被告大方便发一本v被告大方便发一本v被告大方便发一本v被告
          大方便发一本v被告大方便发一本v被告大方便发一本v被告大方便发一本v被告
        </p>
        <a href="#">READ MORE</a>
      </div>
    </div>
    <!-- 新闻动态 -->
    <div id="news" class="container">
      <div class="title">
        <div>
          新闻动态
          <small>NEWS CENTER</small>
        </div>
      </div>
      <div class="content clearfix">
        <div>
          <a href="#"><img src="images/pic06.jpg" alt=""></a>
          <ul>
            <li><a href="#"><span class="chat">[行业资讯]</span> 家纺行业的四大走向 <span class="time">2014-10-20</span></a>
            </li>
            <li><a href="#"><span class="chat">[行业资讯]</span> 家纺行业：从价值链的薄弱环节找到 <span class="time">2014-10-20</span></a>
            </li>
            <li><a href="#"><span class="chat">[行业资讯]</span> 2009年净利润同比增长34.4 <span class="time">2014-10-20</span></a>
            </li>
            <li><a href="#"><span class="chat">[行业资讯]</span> 家电涨价与降价背后的营销逻辑 <span class="time">2014-10-20</span></a></li>
            <li><a href="#"><span class="chat">[行业资讯]</span> 高科技家电未来都很低碳 <span class="time">2014-10-20</span></a></li>
            <li><a href="#"><span class="chat">[行业资讯]</span> XX网加盟“绿书签”行动 <span class="time">2014-10-20</span></a></li>
          </ul>
        </div>
        <div>
          <a href="#"><img src="images/pic07.jpg" alt=""></a>
          <ul>
            <li><a href="#"><span class="chat">[公司动态]</span> 迎|“十一”主题优惠即将开幕 <span class="time">2014-10-20</span></a>
            </li>
            <li><a href="#"><span class="chat">[公司动态]</span> **家纺驻外办事处相继成立 <span class="time">2014-10-20</span></a></li>
            <li><a href="#"><span class="chat">[公司动态]</span> **家纺驻外办事处相继成立 <span class="time">2014-10-20</span></a></li>
            <li><a href="#"><span class="chat">[公司动态]</span> 继往开来 搏击10 <span class="time">2014-10-20</span></a>
            </li>
            <li><a href="#"><span class="chat">[公司动态]</span> **组团参加第十七届中国（上海） <span class="time">2014-10-20</span></a>
            </li>
            <li><a href="#"><span class="chat">[公司动态]</span> **家居体验馆盛大开业 <span class="time">2014-10-20</span></a></li>
          </ul>
        </div>
        <div class="last">
          <a href="#"><img src="images/pic08.jpg" alt=""></a>
          <ul>
            <li><a href="#"><span class="chat">[媒体热点]</span> 有意实施行业内重组蕴藏可升值资 <span class="time">2014-10-20</span></a>
            </li>
            <li><a href="#"><span class="chat">[媒体热点]</span> 端午节家电大力促销 <span class="time">2014-10-20</span></a>
            </li>
            <li><a href="#"><span class="chat">[媒体热点]</span> 家纺与电影 <span class="time">2014-10-20</span></a></li>
            <li><a href="#"><span class="chat">[媒体热点]</span> 家纺行业：从价值链的薄弱环节找到 <span class="time">2014-10-20</span></a>
            </li>
            <li><a href="#"><span class="chat">[媒体热点]</span> 当前中国家纺市场现状及前景预测 <span class="time">2014-10-20</span></a></li>
            <li><a href="#"><span class="chat">[媒体热点]</span> 家纺行业的四大走向 <span class="time">2014-10-20</span></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 页脚 -->
    <div id="footer">
      <div class="container">
        <div class="top clearfix">
          <div class="contact">
            <a href="#"><img src="images/logo2.jpg" alt=""></a>
            <a href="#">
              <div class="pic1">&emsp;&emsp;中国上海市xxx区xxx路12号moumou大厦5层5xx室</div>
            </a>
            <a href="#">
              <div class="pic2">&emsp;&emsp;400-000-xxxx / (021)-1234578xxx</div>
            </a>
            <a href="#">
              <div class="pic3">&emsp;&emsp;12385963xxxx@gmail.com</div>
            </a>
          </div>
          <div class="interlinkage clearfix">
            <h1>快速链接</h1>
            <ul>
              <li><a href="#">> 网站首页</a></li>
              <li><a href="#">> 产品展示</a></li>
              <li><a href="#">> 在线留言</a></li>
            </ul>
            <ul>
              <li><a href="#">> 关于我们</a></li>
              <li><a href="#">> 新闻动态</a></li>
              <li><a href="#">> 联系我们</a></li>
            </ul>
          </div>
          <div class="search">
            <h1>站内搜索</h1>
            <form action="#">
              <input type="text" placeholder=" 请输入关键字"><button type="submit">搜索</button>
            </form>
            <a href="#">关注我们 <img src="images/fenxiang.png" alt=""></a>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="container">
          <p>Copyright © 2009-2011,www.XXXXXX.com,All rights reserved 沪ICP备XXXXXXX号未经同意,不得转载</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      swiperList: [
        { url: '/src/assets/images/banner2.jpg' },
        { url: '/src/assets/images/banner1.png' },
      ]
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  }
}
</script>

<style lang="scss" scoped>
// 外嵌样式表
@import url('../assets/css/reset.css');
@import url('../assets/css/common.css');
@import url('../assets/css/index.css');

#banner img {
  object-fit: cover;
}

:deep(.el-carousel) {
  overflow-x: visible;
}

.carousel {
  overflow: hidden;
  min-width: 1200px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>