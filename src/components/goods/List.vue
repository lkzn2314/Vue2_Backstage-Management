<template>
	<div id="list">
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图 -->
		<el-card>
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" 
					clearable @clear="getGoods">
						<el-button slot="append" icon="el-icon-search" @click="getGoods"></el-button>
					</el-input>
				</el-col>

				<el-col :span="6">
					<el-button type="primary" @click="goAddGoods">添加商品</el-button>
				</el-col>
			</el-row>

			<!-- table表格区 -->
			<el-table :data="goodsList" stripe border>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="商品名称" prop="goods_name"></el-table-column>
				<el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
				<el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
				<el-table-column label="创建时间" width="140px">
					<template slot-scope="scope">
						{{scope.row.add_time | formatDate}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="130px">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
						<el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteClick(scope.row.goods_id)"></el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页区 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
			:current-page="queryInfo.pagenum" :page-sizes="[10, 15, 20, 30]"
			:page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>

	</div>
</template>

<script>
	export default {
		name: 'List',
		data() {
			return {
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 10
				},
				goodsList: [],
				total: 0
			}
		},
		created() {
			this.getGoods()
		},
		methods: {
			async getGoods() {
				const {
					data: res
				} = await this.$http.get('goods', {
					params: this.queryInfo
				})
				// console.log(res)
				if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
				this.goodsList = res.data.goods
				this.total = res.data.total
			},
			handleSizeChange(newSize) {
				this.queryInfo.pagesize = newSize
				this.getGoods()
			},
			handleCurrentChange(currentPage) {
				this.queryInfo.pagenum = currentPage
				this.getGoods()
			},
			async deleteClick(id) {
				const confirmRe = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).catch(err => err)
				if(confirmRe !== 'confirm') return this.$message.info('已取消删除')
				const {data: res} = await this.$http.delete('goods/' + id)
				if(res.meta.status !== 200) return this.$message.error('删除失败')
				this.$message.success('删除成功')
				this.getGoods()
			},
			goAddGoods() {
				this.$router.push('/goods/add')
			}
		}
	}
</script>

<style scoped>
</style>
