<template>
  <div>
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-xl font-bold">身份类型管理</h1>
        <button 
          @click="showAddModal" 
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <i class="fas fa-plus mr-1"></i>
          添加身份类型
        </button>
      </div>
      
      <!-- 身份类型列表 -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">身份代码</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">身份名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">默认</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">认证要求</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">有效期(天)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所需字段</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in identityTypes" :key="item.code" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.code }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span v-if="item.isDefault" class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">默认</span>
                <span v-else>-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span v-if="item.needCertification" class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">需要认证</span>
                <span v-else class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">无需认证</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.needCertification ? item.validityDays : '-' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                <div v-if="item.needCertification && item.certificationRequirements?.requiredFields?.length" class="flex flex-wrap gap-1">
                  <span 
                    v-for="field in item.certificationRequirements.requiredFields" 
                    :key="field"
                    class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700"
                  >
                    {{ fieldLabels[field] || field }}
                  </span>
                </div>
                <span v-else>-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex space-x-2">
                  <button 
                    @click="handleEdit(item)"
                    class="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    编辑
                  </button>
                  <button 
                    v-if="!item.isDefault"
                    @click="handleDelete(item.code)"
                    class="text-red-600 hover:text-red-800 font-medium"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 添加/编辑身份类型弹窗 -->
    <div v-if="modalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-[550px] max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium">{{ isEdit ? '编辑身份类型' : '添加身份类型' }}</h3>
        </div>
        
        <div class="px-6 py-4">
          <form ref="formRef" @submit.prevent="handleOk">
            <!-- 身份代码 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">身份代码</label>
              <input
                type="text"
                v-model="formState.code"
                :disabled="isEdit"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="大写英文，如 FARMER、EXPERT"
                :class="{'border-red-500': formErrors.code}"
              />
              <p v-if="formErrors.code" class="mt-1 text-sm text-red-500">{{ formErrors.code }}</p>
            </div>
            
            <!-- 身份名称 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">身份名称</label>
              <input
                type="text"
                v-model="formState.name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="如：农户"
                :class="{'border-red-500': formErrors.name}"
              />
              <p v-if="formErrors.name" class="mt-1 text-sm text-red-500">{{ formErrors.name }}</p>
            </div>
            
            <!-- 是否为默认身份 -->
            <div class="mb-4">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  v-model="formState.isDefault"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="isDefault" class="ml-2 block text-sm text-gray-700">默认身份</label>
              </div>
            </div>
            
            <!-- 是否需要认证 -->
            <div class="mb-4">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="needCertification"
                  v-model="formState.needCertification"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="needCertification" class="ml-2 block text-sm text-gray-700">需要认证</label>
              </div>
            </div>
            
            <!-- 认证相关配置（条件渲染） -->
            <div v-if="formState.needCertification" class="border-t border-gray-200 pt-4 mt-4">
              <h4 class="font-medium mb-3">认证配置</h4>
              
              <!-- 认证有效期 -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">认证有效期(天)</label>
                <input
                  type="number"
                  v-model.number="formState.validityDays"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{'border-red-500': formErrors.validityDays}"
                />
                <p v-if="formErrors.validityDays" class="mt-1 text-sm text-red-500">{{ formErrors.validityDays }}</p>
              </div>
              
              <!-- 认证所需字段 -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">认证所需字段</label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <div 
                    v-for="(field, index) in formState.requiredFields" 
                    :key="index"
                    class="flex items-center bg-blue-50 px-2 py-1 rounded-md"
                  >
                    <span>{{ field }}</span>
                    <button 
                      type="button" 
                      @click="removeField(index)" 
                      class="ml-1 text-gray-500 hover:text-red-500"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div class="flex">
                  <input
                    type="text"
                    v-model="newFieldName"
                    placeholder="输入新字段名称，如：身份证、营业执照等"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button 
                    type="button"
                    @click="addField"
                    class="px-3 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    添加
                  </button>
                </div>
              </div>
              
              <!-- 认证要求描述 -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">认证要求描述</label>
                <textarea
                  v-model="formState.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="描述认证所需资料，如：需要提供身份证和营业执照"
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
          <button 
            @click="handleCancel"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            取消
          </button>
          <button 
            @click="handleOk"
            :disabled="confirmLoading"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ confirmLoading ? '提交中...' : '确定' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import identityService from '@/api/services/identity.service'

// 表单引用
const formRef = ref(null)

// 身份类型列表数据
const identityTypes = ref([])
const loading = ref(false)
const newFieldName = ref('')

// 字段名称标签映射
const fieldLabels = {
  idCard: '身份证',
  businessLicense: '营业执照',
  foodPermit: '食品经营许可证',
  taxCertificate: '税务登记证',
  warehousePermit: '仓储许可证',
  landCertificate: '土地证明',
  professionalCert: '专业证书',
  workProof: '工作证明',
  qualityCert: '质量认证',
  transportPermit: '运输许可证',
  healthCert: '健康证明',
  tradeLicense: '贸易许可证',
  other: '其他'
}

// 弹窗状态
const modalVisible = ref(false)
const confirmLoading = ref(false)
const isEdit = ref(false)

// 表单状态和校验错误
const formState = reactive({
  code: '',
  name: '',
  isDefault: false,
  needCertification: false,
  validityDays: 365,
  requiredFields: [],
  description: ''
})

const formErrors = reactive({
  code: '',
  name: '',
  validityDays: ''
})

// 生命周期钩子
onMounted(() => {
  fetchIdentityTypesWithRetry()
})

// 获取身份类型列表
const fetchIdentityTypes = async () => {
  loading.value = true
  try {
    const response = await identityService.getIdentityTypes()
    identityTypes.value = response.data || []
  } catch (error) {
    console.error('获取身份类型失败:', error)
    alert('获取身份类型数据失败')
  } finally {
    loading.value = false
  }
}

// 显示添加弹窗
const showAddModal = () => {
  resetForm()
  isEdit.value = false
  modalVisible.value = true
}

// 处理编辑
const handleEdit = (record) => {
  isEdit.value = true
  // 填充表单数据
  Object.assign(formState, {
    code: record.code,
    name: record.name,
    isDefault: record.isDefault,
    needCertification: record.needCertification,
    validityDays: record.validityDays,
    requiredFields: record.certificationRequirements?.requiredFields || [],
    description: record.certificationRequirements?.description || ''
  })
  modalVisible.value = true
}

// 处理删除
const handleDelete = async (code) => {
  if (!confirm(`确定要删除身份类型 "${code}" 吗？`)) {
    return
  }
  
  try {
    await identityService.deleteIdentityType(code)
    alert('删除成功')
    
    // 使用重试机制获取最新数据
    setTimeout(() => {
      fetchIdentityTypesWithRetry()
    }, 1000)
  } catch (error) {
    console.error('删除身份类型失败:', error)
    alert(error.response?.data?.message || '删除失败')
  }
}

// 取消弹窗
const handleCancel = () => {
  modalVisible.value = false
  resetForm()
}

// 验证表单
const validateForm = () => {
  let isValid = true
  
  // 重置错误
  Object.keys(formErrors).forEach(key => formErrors[key] = '')
  
  // 验证身份代码
  if (!formState.code) {
    formErrors.code = '请输入身份代码'
    isValid = false
  } else if (!/^[A-Z_]+$/.test(formState.code)) {
    formErrors.code = '身份代码只能包含大写字母和下划线'
    isValid = false
  }
  
  // 验证身份名称
  if (!formState.name) {
    formErrors.name = '请输入身份名称'
    isValid = false
  }
  
  // 验证认证有效期
  if (formState.needCertification) {
    if (!formState.validityDays) {
      formErrors.validityDays = '请输入认证有效期'
      isValid = false
    } else if (formState.validityDays < 1) {
      formErrors.validityDays = '认证有效期必须大于0'
      isValid = false
    }
  }
  
  return isValid
}

// 提交表单
const handleOk = async () => {
  if (!validateForm()) {
    return
  }
  
  confirmLoading.value = true
  try {
    // 准备提交数据
    const submitData = {
      code: formState.code,
      name: formState.name,
      isDefault: formState.isDefault,
      needCertification: formState.needCertification
    }
    
    // 如果需要认证，添加认证相关信息
    if (formState.needCertification) {
      submitData.validityDays = formState.validityDays
      submitData.requiredFields = formState.requiredFields
      submitData.description = formState.description
    }
    
    if (isEdit.value) {
      // 更新身份类型
      const { code, ...updateData } = submitData
      await identityService.updateIdentityType(code, updateData)
      modalVisible.value = false
      alert('更新成功')
    } else {
      // 创建身份类型
      await identityService.createIdentityType(submitData)
      modalVisible.value = false
      alert('创建成功')
    }
    
    // 添加延迟后再获取最新数据
    setTimeout(() => {
      fetchIdentityTypesWithRetry()
    }, 1000)
  } catch (error) {
    console.error('保存身份类型失败:', error)
    alert(error.response?.data?.message || '保存失败')
  } finally {
    confirmLoading.value = false
  }
}

// 带重试机制的获取身份类型列表
const fetchIdentityTypesWithRetry = async (retryCount = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      // 尝试获取数据前添加一定的延迟，给后端更多时间处理前一个请求
      if (attempt > 1) {
        console.log(`等待 ${delay}ms 后重试...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
      
      await fetchIdentityTypes()
      console.log('成功获取身份类型数据')
      return // 成功获取数据，直接返回
    } catch (error) {
      console.log(`获取身份类型失败 (尝试 ${attempt}/${retryCount})`, error)
      if (attempt < retryCount) {
        // 每次重试增加等待时间
        delay = delay * 1.5
      } else {
        // 达到最大重试次数，显示错误
        console.error('获取身份类型失败，已重试多次:', error)
        alert('获取身份类型数据失败，请稍后刷新页面')
      }
    }
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(formState, {
    code: '',
    name: '',
    isDefault: false,
    needCertification: false,
    validityDays: 365,
    requiredFields: [],
    description: ''
  })
  Object.keys(formErrors).forEach(key => formErrors[key] = '')
}

// 移除字段
const removeField = (index) => {
  formState.requiredFields.splice(index, 1)
}

// 添加字段
const addField = () => {
  if (newFieldName.value) {
    formState.requiredFields.push(newFieldName.value)
    newFieldName.value = ''
  }
}
</script> 