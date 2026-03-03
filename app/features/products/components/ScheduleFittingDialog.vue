<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';

interface Props {
  productId: number | string;
  productName?: string;
}

const props = defineProps<Props>();

const isOpen = defineModel<boolean>('open', { default: false });

const productsStore = useProductsStore();
const toast = useToast();

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  description: '',
});

const isPhoneValid = ref(false);

function handlePhoneValidation(valid: boolean) {
  isPhoneValid.value = valid;
}

const validPhone = helpers.withMessage(
  'Please enter a valid phone number',
  () => isPhoneValid.value
);

const rules = computed(() => ({
  fullName: {
    required: helpers.withMessage('Full name is required', required),
  },
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Please enter a valid email', email),
  },
  phone: {
    required: helpers.withMessage('Phone number is required', required),
    validPhone,
  },
  address: {
    required: helpers.withMessage('Address is required', required),
  },
  description: {
    required: helpers.withMessage('Description is required', required),
  },
}));

const v$ = useVuelidate(rules, form);

async function handleSubmit() {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  try {
    await productsStore.scheduleFitting({
      customer_name: form.value.fullName,
      email: form.value.email,
      phone: form.value.phone,
      address: form.value.address,
      description: form.value.description || '',
      product_id: Number(props.productId),
    });

    toast.add({
      title: 'Fitting Scheduled',
      description: 'Your fitting request has been submitted. A merchant will contact you soon.',
      color: 'success',
      icon: 'i-lucide-check-circle',
    });

    resetForm();
    isOpen.value = false;
  } catch {
    toast.add({
      title: 'Request Failed',
      description: productsStore.fittingError || 'Failed to schedule fitting',
      color: 'error',
      icon: 'i-lucide-circle-x',
    });
  }
}

function resetForm() {
  form.value = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
  };
  v$.value.$reset();
  isPhoneValid.value = false;
  productsStore.resetFittingState();
}

function handleClose() {
  resetForm();
  isOpen.value = false;
}

watch(isOpen, (open) => {
  if (!open) {
    resetForm();
  }
});
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :ui="{ content: 'sm:max-w-lg max-h-[85dvh] overflow-hidden flex flex-col', overlay: 'z-50' }"
  >
    <template #content>
      <div class="flex flex-1 flex-col overflow-y-auto overscroll-contain p-6">
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Schedule Fitting</h2>
            <button
              type="button"
              class="flex size-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              @click="handleClose"
            >
              <UIcon name="i-lucide-x" class="size-5" />
            </button>
          </div>
          <p class="mt-1 text-sm text-gray-500">
            Fill in your personal information below for a merchant to contact you for further
            details.
          </p>
          <p v-if="productName" class="mt-2 text-sm font-medium text-primary">
            Product: {{ productName }}
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label for="fullName" class="mb-1.5 block text-sm font-medium text-gray-700">
              Full Name
              <span class="text-red-500">*</span>
            </label>
            <AppInput
              id="fullName"
              v-model="form.fullName"
              placeholder="John Doe"
              :highlight="v$.fullName.$error"
              :color="v$.fullName.$error ? 'error' : undefined"
              @blur="v$.fullName.$touch()"
            />
            <p v-if="v$.fullName.$error" class="mt-1 text-xs text-red-500">
              {{ v$.fullName.$errors[0]?.$message }}
            </p>
          </div>

          <div>
            <label for="fittingEmail" class="mb-1.5 block text-sm font-medium text-gray-700">
              Email
              <span class="text-red-500">*</span>
            </label>
            <AppInput
              id="fittingEmail"
              v-model="form.email"
              type="email"
              placeholder="john@example.com"
              :highlight="v$.email.$error"
              :color="v$.email.$error ? 'error' : undefined"
              @blur="v$.email.$touch()"
            />
            <p v-if="v$.email.$error" class="mt-1 text-xs text-red-500">
              {{ v$.email.$errors[0]?.$message }}
            </p>
          </div>

          <div>
            <label for="fittingPhone" class="mb-1.5 block text-sm font-medium text-gray-700">
              Phone Number
              <span class="text-red-500">*</span>
            </label>
            <AppPhoneNumberInput
              id="fittingPhone"
              v-model="form.phone"
              :highlight="v$.phone.$error"
              @blur="v$.phone.$touch()"
              @valid="handlePhoneValidation"
            />
            <p v-if="v$.phone.$error" class="mt-1 text-xs text-red-500">
              {{ v$.phone.$errors[0]?.$message }}
            </p>
          </div>

          <div>
            <label for="fittingAddress" class="mb-1.5 block text-sm font-medium text-gray-700">
              Address
              <span class="text-red-500">*</span>
            </label>
            <AppInput
              id="fittingAddress"
              v-model="form.address"
              placeholder="123 Main St, Kigali"
              :highlight="v$.address.$error"
              :color="v$.address.$error ? 'error' : undefined"
              @blur="v$.address.$touch()"
            />
            <p v-if="v$.address.$error" class="mt-1 text-xs text-red-500">
              {{ v$.address.$errors[0]?.$message }}
            </p>
          </div>

          <div>
            <label for="fittingDescription" class="mb-1.5 block text-sm font-medium text-gray-700">
              Description
              <span class="text-red-500">*</span>
            </label>
            <AppTextArea
              id="fittingDescription"
              v-model="form.description"
              placeholder="Any special requests or preferences..."
              :rows="3"
              :highlight="v$.description.$error"
              @blur="v$.description.$touch()"
            />
            <p v-if="v$.description.$error" class="mt-1 text-xs text-red-500">
              {{ v$.description.$errors[0]?.$message }}
            </p>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              class="flex-1 cursor-pointer rounded-full border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              @click="handleClose"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="productsStore.isSchedulingFitting"
            >
              <UIcon
                v-if="productsStore.isSchedulingFitting"
                name="i-lucide-loader-2"
                class="size-3.5 animate-spin"
              />
              <span>
                {{ productsStore.isSchedulingFitting ? 'Submitting...' : 'Submit Request' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </template>
  </UModal>
</template>
