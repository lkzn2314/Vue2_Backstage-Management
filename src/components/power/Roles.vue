<template>
	<div id="roles">
		<!-- 面包屑导航栏 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图 -->
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
					<!-- 添加角色对话框 -->
					<el-dialog title="添加角色" :visible.sync="dialogVisible"
					width="30">
					  <span>
							<el-form ref="addRoleRef" :model="addRoleForm" label-width="80px">
							  <el-form-item label="角色名称">
							    <el-input v-model="addRoleForm.roleName"></el-input>
							  </el-form-item>
								<el-form-item label="角色描述">
								  <el-input v-model="addRoleForm.roleDesc"></el-input>
								</el-form-item>
							</el-form>
						</span>
					  <span slot="footer" class="dialog-footer">
					    <el-button @click="dialogVisible = false">取 消</el-button>
					    <el-button type="primary" @click="addRole">确 定</el-button>
					  </span>
					</el-dialog>
					
					<!-- 编辑角色对话框 -->
					<el-dialog title="编辑角色" :visible.sync="editDialogVisible"
					width="30">
					  <span>
							<el-form ref="editRoleRef" :model="editRoleForm" :rules="editRoleRules" 
							label-width="80px">
							  <el-form-item label="角色名称"  prop="roleName">
							    <el-input v-model="editRoleForm.roleName"></el-input>
							  </el-form-item>
								<el-form-item label="角色描述">
								  <el-input v-model="editRoleForm.roleDesc"></el-input>
								</el-form-item>
							</el-form>
						</span>
					  <span slot="footer" class="dialog-footer">
					    <el-button @click="editDialogVisible = false">取 消</el-button>
					    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
					  </span>
					</el-dialog>
					
					<!-- 分配权限对话框 -->
					<el-dialog title="分配权限" :visible.sync="disDialogVisible" 
					width="50%" @close="disLimitsClosed">
					<!-- 树形控件 -->
						<el-tree ref="treeRef" :data='rightsList' :props="treeProps" 
						node-key="id" default-expand-all show-checkbox
						:default-checked-keys="defKeys"></el-tree>
					  <span slot="footer" class="dialog-footer">
					    <el-button @click="disDialogVisible = false">取 消</el-button>
					    <el-button type="primary" @click="allotRights">确 定</el-button>
					  </span>
					</el-dialog>
					
				</el-col>
			</el-row>

			<!-- 角色列表区 -->
			<el-table :data="roleList" border stripe>
				<!-- 展开列 -->
				<el-table-column type="expand">
					<template slot-scope="scope">
						<el-row :class="['vcenter', 'bdbottom', index1 === 0 ? 'bdtop' : '']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
							<!-- 一级权限 -->
							<el-col :span="5">
								<el-tag closable @close="removeRights(scope.row, item1.id)">{{item1.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!-- 二级和三级权限 -->
							<el-col :span="19">
								
								<!-- 渲染二级 -->
								<el-row :class="['vcenter', index2 === 0 ? '' : 'bdtop']" v-for="(item2, index2) in item1.children" :key="item2.id">
									<el-col :span="6">
										<el-tag type="success" closable @close="removeRights(scope.row, item2.id)">{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									
									<el-col :span="18">
										<el-tag type="warning" closable @close="removeRights(scope.row, item3.id)"
										v-for="(item3, index3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>

				<el-table-column type="index"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				
				<el-table-column lable="操作" width="300px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-search" size="mini" @click="editRole(scope.row.id)">编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
						<el-button type="warning" icon="el-icon-star-off" size="mini" @click="disLimits(scope.row)">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

	</div>
</template>

<script>
	export default {
		name: 'Roles',
		data() {
			return {
				roleList: [],
				rightsList: [],
				dialogVisible: false,
				editDialogVisible: false,
				disDialogVisible: false,
				// 树形控件属性绑定对象
				treeProps: {
					children: 'children',
					label: 'authName'
				},
				//默认选中的节点Id
				defKeys: [],
				//当前即将分配权限的角色id
				roleId: '',
				addRoleForm: {
					roleName: '',
					roleDesc: ''
				},
				editRoleForm: {},
				editRoleRules: {
					roleName: [
						 { required: true, message: '不能为空', trigger: 'blur' }
					]
				}
			}
		},
		created() {
			this.getRoleList()
		},
		methods: {
			async getRoleList() {
				const {
					data: res
				} = await this.$http.get('roles')
				if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
				this.roleList = res.data
				// console.log(this.roleList)
			},
			//添加角色
			addRole() {
				this.$refs.addRoleRef.validate(async valid => {
					if(!valid) return 
					const{data: res} = await this.$http.post('roles', this.addRoleForm)
					this.addRoleForm = res
					console.log(this.addRoleForm)
					if(res.meta.status !== 201) return this.$message.error('添加角色失败')
					this.$message.success('添加角色成功')
					this.getRoleList()
					this.dialogVisible = false
				})
			},
			//编辑角色修改信息
			async editRole(id) {
				const {data:res} = await this.$http.get('roles/' + id)
				if(res.meta.status !== 200) return this.$message.error('获取角色失败')
				this.editRoleForm = res.data
				// console.log(this.editRoleForm)
				this.editDialogVisible = true
			},
			//提交角色修改
			editRoleInfo() {
				this.$refs.editRoleRef.validate(async valid => {
					if(!valid) return 
					const {data:res} = await this.$http.put('roles/' + this.editRoleForm.roleId, {
						roleName: this.editRoleForm.roleName,
						roleDesc: this.editRoleForm.roleDesc
					})
					if(res.meta.status !== 200) return this.$message.error('编辑角色失败')
					this.$message.success('编辑成功')
					this.getRoleList()
					this.editDialogVisible = false

				})
			},
			//删除角色
			async deleteRole(id) {
				const confirmR = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).catch(err => err)
				if(confirmR !== 'confirm') return 
				const {data:res} = await this.$http.delete('roles/' + id) 
				if(res.meta.status !== 200) this.$message.error('删除失败')
				this.$message.success('删除成功')
				this.getRoleList()
			},
			//分配权限
			async disLimits(role) {
				const {data:res} = await this.$http.get('rights/tree')
				if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')
				this.rightsList = res.data
				this.getLeafKeys(role, this.defKeys)
				//将角色id保存
				this.roleId = role.id
				this.disDialogVisible = true
			},
			//监听分配权限对话框关闭事件
			disLimitsClosed() {
				this.defKeys = []
			},
			//点击为角色分配权限
			async allotRights() {
				const keys = [...this.$refs.treeRef.getCheckedKeys(),
				...this.$refs.treeRef.getHalfCheckedKeys()]
				
				const idStr = keys.join(',')
				
				const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr})
				if(res.meta.status !== 200) return this.$message.error('分配权限失败')
				this.$message.success('分配权限成功')
				this.getRoleList()
				this.disDialogVisible = false
			},
			//移除权限
			async removeRights(role, rightId) {
				const confirmR = await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
				if(confirmR !== 'confirm') return this.$message.info('已取消删除')
				this.$message.success('删除成功')
				
				const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
				if(res.meta.status !== 200) return this.$message.error('取消权限失败')
				//确保不是每次修改后全部刷新
				role.children = res.data 
			},
			//通过递归形式，获取角色下所有三级权限的Id并保存起来
			getLeafKeys(node, arr) {
				if(!node.children) {
					return arr.push(node.id)
				}
				node.children.forEach(item => this.getLeafKeys(item, arr))
			}
		}
	}
</script>

<style scoped>
	.el-tag {
		margin: 7px;
	}

	.bdtop {
		border-top: 1px solid #eee;
	}

	.bdbottom {
		border-bottom: 1px solid #eee;
	}
	
	.vcenter {
		display: flex;
		align-items: center;
	}
</style>
