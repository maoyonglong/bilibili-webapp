<template>
  <div class="login">
    <div class="cell-wrap">
      <cell
        middleText="登录bilibili"
        :rightText="way === 0 ? '密码登录' : '短信登陆'"
        @click="onChangeWay"
      />
    </div>
    <div class="message-way" v-if="way === 0">
      <div class="cell-wrap">
        <cell leftText="中国大陆">
          <a slot="right" class="icon">
            <svg aria-hidden="true"><use xlink:href="#icon-gengduo"></use></svg>
          </a>
        </cell>
      </div>
      <div class="cell-wrap">
        <cell leftText="+86">
          <input slot="middle" type="text" placeholder="请输入手机号">
          <a slot="right" class="code keyword">
            获取验证码
          </a>
        </cell>
        <cell leftText="验证码">
          <input slot="middle" type="text" placeholder="请输入验证码">
        </cell>
      </div>
      <div class="btn-wrap">
        <a class="btn">验证登陆</a>
      </div>
    </div>
    <div class="pwd-way" v-else>
      <div class="cell-wrap">
        <cell leftText="账号">
          <input slot="middle" type="text" placeholder="你的手机号/邮箱">
        </cell>
        <cell leftText="密码">
          <input slot="middle" type="text" placeholder="请输入密码">
        </cell>
      </div>
      <div class="forget">
        <a href="" class="keyword">忘记密码</a>
      </div>
      <div class="btn-wrap">
        <a href="" class="btn register">注册</a>
        <a href="" class="btn login">登陆</a>
      </div>
    </div>
    <p class="notice">
      登录即代表你同意<a href="" class="keyword">用户协议</a>和<a href="" class="keyword">隐私政策</a>
    </p>
  </div>
</template>

<script>
import Cell from '@/components/Cell'

export default {
  components: {
    Cell
  },
  data () {
    return {
      way: 0
    }
  },
  methods: {
    onChangeWay (t) {
      if (t === 'right') {
        this.way = this.way === 0 ? 1 : 0
      }
    }
  }
}
</script>

<style lang='scss'>
body {
  background-color: $c-bg-whitef4;
}
</style>

<style lang="scss" scoped>
.cell-wrap {
  margin-bottom: 32px;
}
svg {
  display: block;
  width: 32px;
  height: 32px;
  fill: $c-icon-gray;
}
input {
  flex: 1;
  padding: 24px 0;
  border: 0;
  outline: none;
}
.code {
  line-height: 52px;
  padding-left: 24px;
  border-left: 1px solid $c-b-gray;
}
.keyword {
  color: $c-t-pink;
}
.btn {
  line-height: 88px;
  text-align: center;
  font-size: $t-lg;
  color: $c-t-white;
  background-color: $c-bg-pink;
  border-radius: 8px;
  border: 1px solid $c-b-pink;
  &-wrap {
    padding: 0 24px;
  }
}
.notice {
  color: $c-t-gray;
  line-height: 88px;
  text-align: center;
  a {
    display: inline;
  }
}
.forget {
  text-align: right;
  padding-right: 24px;
  margin-bottom: 24px;
  a {
    display: inline;
  }
}
.pwd-way {
  .btn {
    flex: 1;
    &.register {
      margin-right: 24px;
      background: $c-t-white;
      color: $c-t-pink;
    }
    &-wrap {
      display: flex;
      padding: 0 24px;
    }
  }
}
</style>
