<template>
  <div class="comment">
    <div class="comment__item" v-for="(comment, commentIdx) in comments" :key="commentIdx">
      <div>
        <img class="comment__item__avatar" :data-src="comment.avatar">
      </div>
      <div>
        <div class="comment__item__info">
          <router-link to="#" class="comment__item__info__author">{{comment.uname}}</router-link>
          <!-- <span class="comment__item__info__date">{{comment.member.}}</span> -->
        </div>
        <p class="comment__item__content">
          {{comment.message}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comments: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.comment {
  color: $c-t-black1;
  &__item {
    display: flex;
    padding: 30px 24px;
    &__avatar {
      width: 80px;
      height: 80px;
      margin-right: 30px;
      border-radius: 50%;
    }
    &__info {
      &__author {
        font-size: $t-md;
        color: $c-t-gray;
      }
    }
    &__content {
      line-height: 38px;
      font-size: $t-lg;
    }
  }
}
</style>
