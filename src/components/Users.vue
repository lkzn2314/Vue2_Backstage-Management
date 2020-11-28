<template>
	<div id="users">
		<!-- 面包屑导航栏 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图 -->
		<el-card class="box-card">
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="6">
					<el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
					
					<!-- 添加用户对话框 -->
					<el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
					  <span>
							<el-form :model="addForm" :rules="addFormRules" ref="ruleForm" label-width="70px">
							  <el-form-item label="用户名" prop="username">
							    <el-input v-model="addForm.username"></el-input>
							  </el-form-item>
								<el-form-item label="密码" prop="password">
								  <el-input v-model="addForm.password"></el-input>
								</el-form-item>
								<el-form-item label="邮箱" prop="email">
								  <el-input v-model="addForm.email"></el-input>
								</el-form-item>
								<el-form-item label="手机" prop="mobile">
								  <el-input v-model="addForm.mobile"></el-input>
								</el-form-item>
							</el-form>	
						</span>
					  <span slot="footer" class="dialog-footer">
					    <el-button @click="dialogVisible = false">取 消</el-button>
					    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
					  </span>
					</el-dialog>
				</el-col>
			</el-row>

			<!-- 用户列表区 -->
			<el-table :data="userList" border stripe>
				<el-table-column type="index"></el-table-column>

				<el-table-column label="姓名" prop="username"></el-table-column>
				<el-table-column label="邮箱" prop="email"></el-table-column>
				<el-table-column label="电话" prop="mobile"></el-table-column>
				<el-table-column label="角色" prop="role_name"></el-table-column>

				<el-table-column label="状态">
					<!-- 作用域插槽 -->
					<template slot-scope="scope">
						<el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch> <!-- {{scope.row}} 获取的是对应行的数据 -->
					</template>
				</el-table-column>

				<el-table-column label="操作">
					<el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
					<el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
					<!-- 分配角色按钮 -->
					<el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
						<el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
					</el-tooltip>
				</el-table-column>
			</el-table>

			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
			:current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" 
			:page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: 'Users',
		data() {
			//验证邮箱的规则
			var checkEmail = (rule, value, callback) => {
				 const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
				 if(regEmail.test(value)) {
					 return callback()
				 }
				 callback(new Error('请输入正确的邮箱'))
			};
			//验证手机规则
			var checkMobile = (rule, value, callback) => {
				 const regEmail = /^1[3|4|5|7|8]\d{9}$/
				 if(regEmail.test(value)) {
					 return callback()
				 }
				 callback(new Error('请输入正确的手机号'))
			};
			
			return {
				//获取用户列表的参数对象
				queryInfo: {
					query: '',
					pagenum: 1, //当前的页数
					pagesize: 2 //当前每页显示多少条数据
				},
				userList: [],
				total: 0,
				dialogVisible: false,
				addForm: {
					username: '',
					password: '',
					email: '',
					mobile: ''
				},
				addFormRules: {
					username: [
						 {required: true, message: '请输入用户名', trigger: 'blur'}
					],
					password: [
						{required: true, message: '请输入密码', trigger: 'blur'},
						{min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur'}
					],
					email: [
						{required: true, message: '请输入邮箱', trigger: 'blur'},
						{validator: checkEmail, trigger: 'blur'}
					],
					mobile: [						
						{required: true, message: '请输入手机号', trigger: 'blur'},
						{validator: checkMobile, trigger: 'blur'}
					]
				}
			}
		},
		created() {
			this.getUserList()
		},
		methods: {
			async getUserList() {
				const {
					data: res
				} = await this.$http.get('users', {
					params: this.queryInfo
				})
				// console.log(res)
				if (res.meta.status !== 200) return res.meta.msg
				this.userList = res.data.users
				this.total = res.data.total
				// console.log(this.userList)
			},
			//监听pageSize改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pagesize = newSize
				this.getUserList()
			},
			//监听当前页码的改变
			handleCurrentChange(newPage) {
				this.queryInfo.pagenum = newPage
				this.getUserList()
			},
			//监听switch开关状态的改变
			async userStateChanged(userInfo) {
				const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
				if(res.meta.status !== 200) {
					userInfo.ma_state = !userInfo.ma_state
					return this.$message.error('修改状态失败!')
				}
				this.$message.success('修改状态成功!')
			}
		}

	}
</script>

<style>
</style>
