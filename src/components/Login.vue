<template>
	<div class="login">
		<div class="login-box">
			<!-- 头像 -->
			<div class="avator">
				<img src="~assets/img/login.jpg" alt="">
			</div>
			
			<!-- 登录表单区 -->
			<el-form class="form-body" ref="elForm" 
			:model="loginForm" :rules="loginFormRules">
				
				<!-- 用户名 -->
			  <el-form-item prop="username">
			    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
			  </el-form-item>
				
				<!-- 密码 -->
				<el-form-item prop="password">
				  <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-password1"></el-input>
				</el-form-item>
				
				<!-- 按钮区 -->
				<el-form-item class="btns">
					<el-button type="primary" @click="signInClick">登录</el-button>
					<el-button type="info" @click="resetClick">重置</el-button>
				</el-form-item>
			</el-form>
				
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		data() {
			return {
				loginForm: {
					username: 'admin',
					password: '123456'
				},
				loginFormRules: {
					username: [
						{required: true, message: '请输入账号', trigger: 'blur'},
						{min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur'}
					],
					password: [
						{required: true, message: '请输入密码', trigger: 'blur'},
						{min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur'}
					]
				}
			}
		},
		methods: {
			resetClick() {
				this.$refs.elForm.resetFields()
			},
			signInClick() {
				this.$refs.elForm.validate(async valid => {
					if(!valid) return;
					const {data:res} =await this.$http.post('login', this.loginForm);

					if(res.meta.status !== 200) return this.$message.error('请求错误!');
					this.$message.success('请求成功')
					//1、将登录成功之后的token，保存到sessionStorage中
						//1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
						//1.2 token只应在网站打开期间生效，所以保存在sessionStorage
						window.sessionStorage.setItem('token', res.data.token);
						//2、通过编程式导航跳转路由
						this.$router.push('/home')
				})
			}
		}
	
	}
</script>

<style lang="less" scoped>
	.login {
		background-color: #2b4b6b;
		height: 100%;
	}
	.login-box {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 450px;
		height: 300px;
		background-color: #fff;
		border-radius: 6px;
		.avator {
			position: relative;
			left: 50%;
			transform: translate(-50%, -50%);
			height: 130px;
			width: 130px;
			border: 1px solid #eee;
			border-radius: 50%;
			padding: 10px;
			background-color: #fff;
			box-shadow: 0 0 10px #ddd;
			img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
				background-color: #eee;
			}
		}
	}
	.form-body {
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 0 40px;
		box-sizing: border-box;
	}
	
	.btns {
		display: flex;
		justify-content: flex-end;
	}
</style>
