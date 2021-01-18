<template>

	<el-container class="home-container">
		<!-- 头部 -->
		<el-header>
			<div>
				<img src="~assets/img/logo.jpg" alt="">
				电商后台管理系统
			</div>
			<el-button type="info" @click="loginOutClick">退出</el-button>
		</el-header>

		<el-container>
			<!-- 侧边栏 -->
			<el-aside :width="isCollapse ? '64px' : '200px'">
				<!-- 折叠框 -->
				<div class="toggle-botton" @click="toggleClick">|||</div>
				<!-- 侧边栏菜单 -->
				<el-menu background-color="#323744" text-color="#fff" 
				active-text-color="#3898ff" unique-opened :collapse="isCollapse"
				:collapse-transition="false" router :default-active="activePath">

					<!-- 一级菜单 -->
					<el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
						<template slot="title">
							<i :class="icon[item.id]"></i>
							<span>{{item.authName}}</span>
						</template>

						<!-- 二级菜单 -->
						<el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" 
						:key="subItem.id" @click="saveActiveClick('/' + subItem.path)">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>{{subItem.authName}}</span>
							</template>
						</el-menu-item>
					</el-submenu>

				</el-menu>
			</el-aside>
			<!-- 页面主体 -->
			<el-main>
				<router-view/>
			</el-main>
		</el-container>

	</el-container>
</template>

<script>
	export default {
		name: 'Home',
		data() {
			return {
				menulist: [],
				icon: {
					'125': 'iconfont icon-user',
					'103': 'iconfont icon-tijikongjian',
					'101': 'iconfont icon-shangpin',
					'102': 'iconfont icon-danju',
					'145': 'iconfont icon-baobiao'
				},
				isCollapse: false,
				activePath: ''
			}
		},
		created() {
			this.getMenuList()
			
			this.activePath = window.sessionStorage.getItem('activePath')
		},
		methods: {
			loginOutClick() {
				window.sessionStorage.clear('token')
				this.$router.push('/login')
			},
			//请求左侧菜单数据
			async getMenuList() {
				const {
					data: res
				} = await this.$http.get('menus')
				// console.log(res)
				if (res.meta.status !== 200) return res.meta.msg
				this.menulist = res.data
				// console.log(this.menulist)
			},
			//折叠事件
			toggleClick() {
				this.isCollapse = !this.isCollapse
			},
			//session保存的目的是：刷新后还能保持状态
			saveActiveClick(activePath) {
				window.sessionStorage.setItem('activePath', activePath)
				this.activePath = activePath
			}

		}
	}
</script>

<style lang="less" scoped>
	.home-container {
		height: 100%;
	}

	.el-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 0;
		background-color: #373c41;
		font-size: 20px;
		color: #fff;

		>div {
			display: flex;
			align-items: center;

		}
	}

	.el-header img {
		height: 60px;
		margin-right: 10px;
	}

	.el-aside {
		background-color: #323744;

		.el-menu {
			border-right: none;
		}
	}

	.el-main {
		background-color: #eaedf2;
	}

	.iconfont {
		margin-right: 10px;
	}
	
	.toggle-botton {
		background-color: #4A5064;
		line-height: 24px;
		font-size: 10px;
		color: #fff;
		text-align: center;
		letter-spacing: .2em;
		cursor: pointer;
	}
</style>
