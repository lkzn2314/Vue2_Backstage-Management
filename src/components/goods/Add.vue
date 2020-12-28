<template>
	<div id="add">
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>

		<el-alert title="添加商品信息" type="info" show-icon :closable="false" center>
		</el-alert>

		<!-- 步骤条 -->
		<el-steps :space="200" :active="activeIndex * 1" finish-status="success" align-center>
			<el-step title="基本信息"></el-step>
			<el-step title="商品参数"></el-step>
			<el-step title="商品属性"></el-step>
			<el-step title="商品图片"></el-step>
			<el-step title="商品内容"></el-step>
			<el-step title="完成"></el-step>
		</el-steps>

		<!-- 竖向标签页 -->
		<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top" label-width="100px">
			<el-tabs v-model="activeIndex" tab-position="left"
			:before-leave="beforeTabLeave" @tab-click="tabClick">
				<el-tab-pane label="基本信息" name="0">
					<el-form-item label="商品名称" prop="goods_name">
						<el-input v-model="addForm.goods_name"></el-input>
					</el-form-item>
					<el-form-item label="商品价格" prop="goods_price">
						<el-input v-model="addForm.goods_price" type="number"></el-input>
					</el-form-item>
					<el-form-item label="商品重量" prop="goods_weight">
						<el-input v-model="addForm.goods_weight"></el-input>
					</el-form-item>
					<el-form-item label="商品数量" prop="goods_number">
						<el-input v-model="addForm.goods_number"></el-input>
					</el-form-item>
					<el-form-item label="商品分类" prop="goods_cat">
						<el-cascader v-model="addForm.goods_cat" :options="cateList" 
						:props="cateCascader" @change="handleChange"></el-cascader>
					</el-form-item>
				</el-tab-pane>
				
				<el-tab-pane label="商品参数" name="1">
					<el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in tabManyData">
						<el-checkbox-group v-model="item.attr_vals">
						  <el-checkbox :label="iitem" :key="index" 
							v-for="(iitem, index) in item.attr_vals" border></el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-tab-pane>
				
				<el-tab-pane label="商品属性" name="2">
					<el-form-item :label="item.attr_name" :keys="item.attr_id" v-for="item in tabOnlyData">
						<el-input v-model="item.attr_vals"></el-input>
					</el-form-item>
				</el-tab-pane>
				
				<el-tab-pane label="商品图片" name="3">
					           <!-- action 表示图片上传到后台的API地址-->
					<el-upload action="http://timemeetyou.com:8889/api/private/v1/upload"
					:on-preview="handlePreview" :on-remove="handleRemove" 
					list-type="picture" :headers="uploadHeaders" :on-success="handleSuccess">  
					  <el-button size="small" type="primary">点击上传</el-button>
					  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
					<!-- 图片预览对话框 -->
					<el-dialog title="图片预览" :visible.sync="previewVisible"
					width="30%">
						<img :src="previewPath" alt="">	
					</el-dialog>
				</el-tab-pane>
				
				<el-tab-pane label="商品内容" name="4">
					<!-- 富文本编辑器组件 -->
					<quill-editor v-model="addForm.goods_introduce"></quill-editor>
					<el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>
				</el-tab-pane>
			</el-tabs>
		</el-form>

	</div>
</template>

<script>
	// import _ from 'lodash'
	var _ = require('lodash')
	
	export default {
		name: 'Add',
		data() {
			return {
				activeIndex: '0',
				addForm: {
					goods_name: '',
					goods_price: 0,
					goods_weight: 0,
					goods_number: 0,
					//商品所属的分类数组
					goods_cat: [], 
					//图片的数组
					pics: [],
					goods_introduce: '',
					attrs: []
				},
				addFormRules: {
					goods_name: [
						{required: true, message: '请输入商品名称', trigger: 'blur'}
					],
					goods_price: [
						{required: true, message: '请输入商品价格', trigger: 'blur'}  
					],
					goods_weight: [
						{required: true, message: '请输入商品重量', trigger: 'blur'}
					],
					goods_number: [
						{required: true, message: '请输入商品数量', trigger: 'blur'}
					],
					goods_cat: [
						{required: true, message: '请选择商品分类', trigger: 'blur'}
					]
				},
				cateList: [],
				cateCascader: {
					expandTrigger: 'hover',
					value:　'cat_id',
					label: 'cat_name',
					children: 'children'
				},
				tabManyData: [],
				tabOnlyData: [],
				//图片上传组件的请求头对象
				uploadHeaders: {
					Authorization: window.sessionStorage.getItem('token')
				},
				previewPath: '',
				previewVisible: false
			}
		},
		created() {
			this.getCateList()
		},
		methods: {
			async getCateList() {
				const {data: res} = await this.$http.get('categories')
				if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
				this.cateList = res.data
				// console.log(res)
			},
			handleChange() {
				// console.log(this.addForm.goods_cat)
				if(this.addForm.goods_cat.length !== 3) {
					this.addForm.goods_cat = []
				}
			},
			beforeTabLeave(activeName, oldName) {
				if(oldName === '0' && this.addForm.goods_cat.length !== 3) {
					this.$message.error('请选择商品分类!')
					return false
				}
			},
			async tabClick() {
				if(this.activeIndex === '1') {
					const {data: res} = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {
						params: {sel: 'many'}
					})
					if(res.meta.status !== 200) return this.$message.error('获取商品参数失败!')
					res.data.forEach(item => {
						item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
					})
					this.tabManyData = res.data
					// console.log(this.tabManyData)
				} else if(this.activeIndex === '2') {
					const {data: res} = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {
						params: {sel: 'only'}
					})
					if(res.meta.status !== 200) return this.$message.error('获取商品属性失败!')
					this.tabOnlyData = res.data
				}
			},
			//处理图片预览效果
			handlePreview(file) {
				this.previewPath =  file.response.data.url
				this.previewVisible = true
			},
			//监听图片上传成功的事件
			handleSuccess(response) {
				//1.拼接得到一个图片对象
				const picInfo = {pic : response.data.tmp_path}
				//2.push到addForm
				this.addForm.pics.push(picInfo)
			},
			//移除图片操作
			handleRemove(file) {
				//1.获取将要删除图片的临时路径 
				const filePath = file.response.data.tmp_path
				//2.找到对应索引值
				const i = this.addForm.pics.findIndex(item => item.pic === filePath)
				//3.移除
				this.addForm.pics.splice(i, 1)
			},
			addGoods() {
				this.$refs.addFormRef.validate(async valid => {
					if(!valid) return this.$message.error('请准确填入必要项!')
					//goods_cat处理
					const form = _.cloneDeep(this.addForm)
					form.goods_cat = form.goods_cat.join(',')
					//动态参数处理
					this.tabManyData.forEach(item => {
						const info = {
							attr_id: item.attr_id, 
							attr_value: item.attr_vals.join(',')
						}
						this.addForm.attrs.push(info) 
					})
					//静态参数处理
					this.tabOnlyData.forEach(item => {
						const info = {
							attr_id: item.attr_id, 
							attr_value: item.attr_vals
						}
						this.addForm.attrs.push(info) 
					})
					form.attrs = this.addForm.attrs
					
					//发起添加商品请求
					const {data: res} = await this.$http.post('goods', form)
			 		if(res.meta.status !== 201) return this.$message.error('添加商品失败!')
					this.$router.push('/goods')
					console.log(res)
					console.log(form)
				})
			}
			
		}
	}
</script>

<style lang="less" scoped>
	.el-step__title {
		font-size: 14px;
	}
	.el-checkbox {
		margin: 0 5px 0 0 !important;
	}
	.el-dialog {
		img {
			width: 100%;
		}
	}
	.addBtn {
		margin: 15px 0;
	}
</style>
