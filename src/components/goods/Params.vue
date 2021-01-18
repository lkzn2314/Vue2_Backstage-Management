<template>
	<div id="params">
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>参数列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图 -->
		<el-card>
			<!-- 警告区 -->
			<el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false">
			</el-alert>
			<!-- 商品分类级联 -->
			<el-row class="elRow">
				<span>选择商品分类：</span>
				<el-cascader v-model="selectedKeys" :options="cateList" 
				:props="cascaderProps" @change="cateChange"></el-cascader>
			</el-row>
			<!-- tab标签页 -->
			<el-tabs v-model="activeName" @tab-click="handleTabClick">
				<el-tab-pane label="动态参数" name="many">
					<el-button type="primary" size="mini" 
					:disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
					<el-table :data="manyData" style="width: 100%" border stripe>
					  <el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag v-for="(item, index) in scope.row.attr_vals" 
								:key="index" closable class="elTag"
								@close="handleClose(scope.row, index)">{{item}}</el-tag>
								
								<!-- 动态编辑标签 -->
								<el-input size="small" class="input-new-tag" v-if="scope.row.inputVisible"
								v-model="scope.row.inputValue" ref="saveTagInput" 
								@keyup.enter.native="handleInputConfirm(scope.row)"
								@blur="handleInputConfirm(scope.row)">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						
						<el-table-column type="index"></el-table-column>
						<el-table-column prop="attr_name" label="参数名称"></el-table-column>
					  
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button size="mini" type="primary" icon="el-icon-edit" @click="editParamsClick(scope.row)">编辑</el-button>
								<el-button size="mini" type="danger"  icon="el-icon-delete">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				
				<el-tab-pane label="静态属性" name="only">
					<el-button type="primary" size="mini" 
					:disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
					<el-table :data="onlyData" style="width: 100%" border stripe>
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag v-for="(item, index) in scope.row.attr_vals" 
								:key="index" closable class="elTag"
								@close="handleClose(scope.row, index)">{{item}}</el-tag>
								
								<el-input size="small" class="input-new-tag" v-if="scope.row.inputVisible"
								v-model="scope.row.inputValue" ref="saveTagInput" 
								@keyup.enter.native="handleInputConfirm(scope.row)"
								@blur="handleInputConfirm(scope.row)">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							
							</template>
						</el-table-column>
						
						<el-table-column type="index"></el-table-column>
						<el-table-column prop="attr_name" label="属性名称"></el-table-column>
					  
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button size="mini" type="primary" icon="el-icon-edit" @click="editParamsClick(scope.row)">编辑</el-button>
								<el-button size="mini" type="danger"  icon="el-icon-delete">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	
		<!-- 添加参数对话框 -->
		<el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible"
		width="50%" @close="addDialogclosed">
		  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
		    <el-form-item :label="titleText" prop="attr_name">
		      <el-input v-model="addForm.attr_name"></el-input>
		    </el-form-item>
			</el-form>	
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addParamsClick">确 定</el-button>
		  </span>
		</el-dialog>
		
		<!-- 编辑对话框 -->
		<el-dialog title="修改参数" :visible.sync="editDialogVisible"
		width="50%" @close="editDialogClosed">
		  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
		    <el-form-item :label="titleText" prop="attr_name">
		      <el-input v-model="editForm.attr_name"></el-input>
		    </el-form-item>
			</el-form>	
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editBtnClick">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'Params',
		data() {
			return {
				cateList: [],
				selectedKeys: [],
				cascaderProps: {
					expandTrigger: 'hover',
					value: 'cat_id',
					label: 'cat_name',
					children: 'children'
				},
				activeName: 'many',
				//动态参数数据
				manyData: [],
				//静态参数数据
				onlyData: [],
				addDialogVisible: false,
				addForm: {
					attr_name: ''
				},
				addFormRules: {
					attr_name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				editDialogVisible: false,
				editForm: {
					attr_name: '',
					attr_id: ''
				},
				editFormRules: {
					attr_name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				}
				
			}
		},
		computed: {
			isBtnDisabled() {
				if(this.selectedKeys.length !== 3) return true
				return false
			},
			//选中的三级分类的id
			cateId() {
				if(this.selectedKeys.length === 3) {
					return this.selectedKeys[2]
				}
				return null
			},
			titleText() {
				if(this.activeName === 'many') return '动态参数'
				return '静态属性'
			}
		},
		created() {
			this.getCatelist()
		},
		
		methods: { 
			async getCatelist() {
				const {
					data: res
				} = await this.$http.get('categories')
				if (res.meta.status !== 200) return this.$message.error('获取失败')
				this.cateList = res.data
			},
			//商品分类级联框改变事件
			cateChange() {
				if (this.selectedKeys.length !== 3) {
					this.selectedKeys = []
					this.manyData = []
					this.onlyData = []
					return
				}
				this.getParams()
			},
			//动静态属性切换
			handleTabClick() {
				this.getParams()
			},
			//获取参数的列表数据
			async getParams() {
				const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
					params: {sel: this.activeName}
				})
				if(res.meta.status !== 200) return  
				res.data.forEach(item => {
					item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
					item.inputVisible = false
					item.inputValue = ''
				})
				console.log(res.data)
				if(this.activeName === 'many') {
					this.manyData = res.data
				} else {
					this.onlyData = res.data
				}
			},
			//对话框关闭
			addDialogclosed() {
				 this.$refs.addFormRef.resetFields()
			},
			//点击添加参数按钮
			addParamsClick() {
				this.$refs.addFormRef.validate(async valid => {
					if(!valid) return 
					const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
						attr_name: this.addForm.attr_name,
						attr_sel: this.activeName
					})
					console.log(res)
					if(res.meta.status !== 201) return this.$message.error('创建失败')
					this.getParams()
					this.addDialogVisible = false
				})
			},
			//点击编辑按钮
			editParamsClick(params) {
				this.editForm.attr_id = params.attr_id
				this.editDialogVisible = true
			},
			//编辑对话框关闭
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
			},
			//编辑对话框确认按钮
			editBtnClick() {
				this.$refs.editFormRef.validate(async valid => {
					if(!valid) return
					const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
						attr_name: this.editForm.attr_name,
						attr_sel: this.activeName
					})
					if(res.meta.status !== 200) return this.$message.error('更新失败!') 
					this.$message.success('更新成功!')
					this.getParams()
					this.editDialogVisible = false
				})
			},
			//点击enter或者失去焦点
			async handleInputConfirm(params) {
				if(params.inputValue.trim().length === 0) {
					params.inputValue = ''
					params.inputVisible = false
					return
				}
				params.attr_vals.push(params.inputValue.trim())
				params.inputVisible = false
				params.inputValue = ''
				const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${params.attr_id}`, {
					attr_name: params.attr_name,
					attr_sel: params.attr_sel,
					attr_vals: params.attr_vals.join(',')
				}) 
				console.log(res)
				if(res.meta.status !== 200) return this.$message.error('修改参数项失败!')
				this.$message.success('修改参数项成功!')
			},
			//newTag切换文本框 
			showInput(params) {
				params.inputVisible = true
				//$nextTick作用，当页面上的元素被重新渲染之后，才会执行回调函数中的代码
				//自动获得焦点
				this.$nextTick(_ => {
				  this.$refs.saveTagInput.$refs.input.focus()
				})
			},
			//删除newTag标签
			async handleClose(params, index) {
				params.attr_vals.splice(index, 1)
				const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${params.attr_id}`, {
					attr_name: params.attr_name,
					attr_sel: params.attr_sel,
					attr_vals: params.attr_vals.join(',')
				}) 
				console.log(res)
				if(res.meta.status !== 200) return this.$message.error('修改参数项失败!')
				this.$message.success('修改参数项成功!')
			}
		}
	}
</script>

<style lang="less" scoped>
	.elRow {
		margin: 15px 0;
	}
	.elTag {
		margin: 10px;
	}
	.input-new-tag {
		width: 120px;
	}
</style>
