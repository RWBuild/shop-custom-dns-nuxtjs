<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
import { formatCurrency } from '~/features/shared/utils';

const { isOpen, currentView, closeDrawer, goToCheckout, goToCart } = useCartDrawer();
const { items, isEmpty, cartSummary, incrementQuantity, decrementQuantity, removeItem, clearCart } =
  useCart();
const { createInvoice, isSubmitting, reset: resetCheckout } = useCheckout();
const toast = useToast();

const cartCurrency = computed(() => 'RWF');

const checkoutForm = ref({
  firstName: '',
  lastName: '',
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
  firstName: {
    required: helpers.withMessage('First name is required', required),
  },
  lastName: {
    required: helpers.withMessage('Last name is required', required),
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
}));

const v$ = useVuelidate(rules, checkoutForm);

const showClearConfirm = ref(false);
const showSuccessDialog = ref(false);

function handleClearCart() {
  if (showClearConfirm.value) {
    clearCart();
    showClearConfirm.value = false;
  } else {
    showClearConfirm.value = true;
    setTimeout(() => {
      showClearConfirm.value = false;
    }, 3000);
  }
}

function handleCheckout() {
  if (isEmpty.value) return;
  goToCheckout();
}

async function handlePlaceOrder() {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  try {
    await createInvoice(
      {
        name: `${checkoutForm.value.firstName} ${checkoutForm.value.lastName}`.trim(),
        email: checkoutForm.value.email,
        phone: checkoutForm.value.phone,
        address: checkoutForm.value.address,
      },
      items.value,
      checkoutForm.value.description
    );

    clearCart();
    checkoutForm.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      description: '',
    };
    v$.value.$reset();
    closeDrawer();
    showSuccessDialog.value = true;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to place order';
    toast.add({
      title: 'Order Failed',
      description: errorMessage,
      color: 'error',
      icon: 'i-lucide-circle-x',
    });
  }
}

function handleBack() {
  goToCart();
}

watch(isOpen, (open) => {
  if (!open) {
    showClearConfirm.value = false;
    resetCheckout();
    v$.value.$reset();
    setTimeout(() => {
      goToCart();
    }, 300);
  }
});

function closeSuccessDialog() {
  showSuccessDialog.value = false;
}
</script>

<template>
  <USlideover
    v-model:open="isOpen"
    side="right"
    :ui="{
      content: 'w-full max-w-md h-[100dvh] min-h-screen z-50',
    }"
  >
    <template #content>
      <div class="flex h-full flex-col bg-white">
        <div class="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-6">
          <div class="flex items-center gap-3">
            <button
              v-if="currentView === 'checkout'"
              type="button"
              class="flex size-8 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Back to cart"
              @click="handleBack"
            >
              <UIcon name="i-lucide-arrow-left" class="size-5" />
            </button>
            <h2 class="text-lg font-semibold text-gray-900">
              {{ currentView === 'cart' ? 'Your Cart' : 'Checkout' }}
            </h2>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="currentView === 'cart' && !isEmpty"
              type="button"
              class="cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
              :class="
                showClearConfirm
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              "
              @click="handleClearCart"
            >
              {{ showClearConfirm ? 'Confirm clear?' : 'Clear all' }}
            </button>
            <button
              type="button"
              class="flex size-8 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close cart"
              @click="closeDrawer"
            >
              <UIcon name="i-lucide-x" class="size-5" />
            </button>
          </div>
        </div>

        <Transition
          mode="out-in"
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 translate-x-4"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 -translate-x-4"
        >
          <div
            v-if="currentView === 'cart'"
            key="cart"
            class="flex flex-1 flex-col overflow-hidden"
          >
            <div v-if="isEmpty" class="flex flex-1 flex-col items-center justify-center px-6 py-12">
              <div class="flex size-20 items-center justify-center rounded-full bg-gray-100">
                <UIcon name="i-lucide-shopping-cart" class="size-10 text-gray-400" />
              </div>
              <h3 class="mt-4 text-base font-medium text-gray-900">Your cart is empty</h3>
              <p class="mt-1 text-center text-sm text-gray-500">
                Looks like you haven't added any items to your cart yet.
              </p>
              <button
                type="button"
                class="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                @click="closeDrawer"
              >
                Continue Shopping
              </button>
            </div>

            <template v-else>
              <div class="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                <div class="space-y-4">
                  <CartItem
                    v-for="item in items"
                    :key="item.id"
                    :item="item"
                    @increment="incrementQuantity"
                    @decrement="decrementQuantity"
                    @remove="removeItem"
                  />
                </div>
              </div>

              <div class="border-t border-gray-200 px-4 py-4 sm:px-6">
                <div class="space-y-2">
                  <div
                    class="flex items-center justify-between border-t border-gray-200 pt-2 text-base"
                  >
                    <span class="font-medium text-gray-900">Total</span>
                    <span class="font-semibold text-gray-900">
                      {{ formatCurrency(cartSummary.total, cartCurrency) }}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  class="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gray-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-900"
                  @click="handleCheckout"
                >
                  Proceed to Checkout
                  <UIcon name="i-lucide-arrow-right" class="size-4" />
                </button>
              </div>
            </template>
          </div>

          <div v-else key="checkout" class="flex flex-1 flex-col overflow-hidden">
            <div class="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              <form class="space-y-4" @submit.prevent="handlePlaceOrder">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label for="firstName" class="mb-1.5 block text-sm font-medium text-gray-700">
                      First Name
                      <span class="text-red-500">*</span>
                    </label>
                    <AppInput
                      id="firstName"
                      v-model="checkoutForm.firstName"
                      placeholder="John"
                      :highlight="v$.firstName.$error"
                      :color="v$.firstName.$error ? 'error' : undefined"
                      @blur="v$.firstName.$touch()"
                    />
                    <p v-if="v$.firstName.$error" class="mt-1 text-xs text-red-500">
                      {{ v$.firstName.$errors[0]?.$message }}
                    </p>
                  </div>
                  <div>
                    <label for="lastName" class="mb-1.5 block text-sm font-medium text-gray-700">
                      Last Name
                      <span class="text-red-500">*</span>
                    </label>
                    <AppInput
                      id="lastName"
                      v-model="checkoutForm.lastName"
                      placeholder="Doe"
                      :highlight="v$.lastName.$error"
                      :color="v$.lastName.$error ? 'error' : undefined"
                      @blur="v$.lastName.$touch()"
                    />
                    <p v-if="v$.lastName.$error" class="mt-1 text-xs text-red-500">
                      {{ v$.lastName.$errors[0]?.$message }}
                    </p>
                  </div>
                </div>

                <div>
                  <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700">
                    Email
                    <span class="text-red-500">*</span>
                  </label>
                  <AppInput
                    id="email"
                    v-model="checkoutForm.email"
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
                  <label for="phone" class="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone
                    <span class="text-red-500">*</span>
                  </label>
                  <AppPhoneNumberInput
                    id="phone"
                    v-model="checkoutForm.phone"
                    :highlight="v$.phone.$error"
                    @blur="v$.phone.$touch()"
                    @valid="handlePhoneValidation"
                  />
                  <p v-if="v$.phone.$error" class="mt-1 text-xs text-red-500">
                    {{ v$.phone.$errors[0]?.$message }}
                  </p>
                </div>

                <div>
                  <label for="address" class="mb-1.5 block text-sm font-medium text-gray-700">
                    Address
                    <span class="text-red-500">*</span>
                  </label>
                  <AppInput
                    id="address"
                    v-model="checkoutForm.address"
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
                  <label for="description" class="mb-1.5 block text-sm font-medium text-gray-700">
                    Additional Notes
                    <span class="text-gray-400">(Optional)</span>
                  </label>
                  <AppTextArea
                    id="description"
                    v-model="checkoutForm.description"
                    placeholder="Any special instructions for delivery..."
                    :rows="3"
                  />
                </div>
              </form>

              <div class="mt-6 rounded-lg bg-gray-50 p-4">
                <h3 class="text-sm font-medium text-gray-900">Order Summary</h3>
                <div class="mt-3 space-y-2">
                  <div
                    v-for="item in items"
                    :key="item.id"
                    class="flex items-center justify-between text-sm"
                  >
                    <span class="text-gray-600">{{ item.name }} × {{ item.quantity }}</span>
                    <span class="font-medium text-gray-900">
                      {{ formatCurrency(item.price * item.quantity, item.currency) }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between border-t border-gray-200 pt-2">
                    <span class="font-medium text-gray-900">Total</span>
                    <span class="font-semibold text-gray-900">
                      {{ formatCurrency(cartSummary.total, cartCurrency) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 px-4 py-4 sm:px-6">
              <button
                type="submit"
                class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="isSubmitting"
                @click="handlePlaceOrder"
              >
                <UIcon v-if="isSubmitting" name="i-lucide-loader-2" class="size-4 animate-spin" />
                <template v-else>
                  <UIcon name="i-lucide-check" class="size-4" />
                  Place Order
                </template>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </template>
  </USlideover>

  <UModal v-model:open="showSuccessDialog" :ui="{ content: 'sm:max-w-md' }">
    <template #content>
      <div class="p-6 text-center">
        <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100">
          <UIcon name="i-lucide-check" class="size-8 text-green-600" />
        </div>
        <h3 class="mt-4 text-lg font-semibold text-gray-900">Order Placed Successfully</h3>
        <p class="mt-2 text-sm text-gray-600">
          Check your email for the invoice and further instructions to complete your order.
        </p>
        <button
          type="button"
          class="mt-6 w-full cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          @click="closeSuccessDialog"
        >
          OK
        </button>
      </div>
    </template>
  </UModal>
</template>
