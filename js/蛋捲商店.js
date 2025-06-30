const { createApp, reactive } = Vue;

createApp({
    data() {
        return {
            currentStep: 1,
            steps: [
                { title: '確認購物車' },
                { title: '付款與運送方式' },
                { title: '填寫資料' },
                { title: '完成訂購' }
            ],
            products: [
                { id: 'p1', name: '原粒芝麻', category: '文青方盒', image: './蛋捲商店/商品選項圖-4.jpg', price: 790, quantity: 1 },
                { id: 'p2', name: '靜岡抹茶', category: '文青方盒', image: './蛋捲商店/商品選項圖-2.jpg', price: 790, quantity: 1 },
                { id: 'p3', name: '原味奶香', category: '文青方盒', image: './蛋捲商店/商品選項圖-5.jpg', price: 790, quantity: 1 }
            ],
            shippingFee: 60,
            paymentMethod: '',
            deliveryMethod: '',
            formData: reactive({
                name: '',
                phone: '',
                email: '',
                address1: '',
                address2: '',
                address: ''
            })
        };
    },
    computed: {
        totalQuantity() {
            return this.products.reduce((sum, item) => sum + item.quantity, 0);
        },
        totalPrice() {
            return this.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        grandTotal() {
            return this.totalPrice + this.shippingFee;
        }
    },
    methods: {
        increaseQuantity(id) {
            const product = this.products.find(p => p.id === id);
            if (product) product.quantity++;
        },
        decreaseQuantity(id) {
            const product = this.products.find(p => p.id === id);
            if (product && product.quantity > 1) product.quantity--;
        },
        removeItem(id) {
            this.products = this.products.filter(p => p.id !== id);
        },
        getStepClass(index) {
            if (index + 1 < this.currentStep) return 'step-completed';
            if (index + 1 === this.currentStep) return 'step-active';
            return 'step-inactive';
        },
        getProgressWidth(index) {
            return index + 1 < this.currentStep ? '100%' : '0%';
        },
        goToNextStep() {
            if (this.currentStep === 1 && this.products.length === 0) {
                alert('購物車為空');
                return;
            }
            if (this.currentStep === 2 && (!this.paymentMethod || !this.deliveryMethod)) {
                alert('請選擇付款與運送方式');
                return;
            }
            if (this.currentStep < this.steps.length) this.currentStep++;
        },
        goToPrevStep() {
            if (this.currentStep > 1) this.currentStep--;
        },
        handleSubmit() {
            // 簡單驗證必填欄位
            if (!this.formData.name.trim() || !this.formData.phone.trim() || !this.formData.email.trim() || !this.formData.address.trim()) {
                alert('請完整填寫所有必填欄位（姓名、電話、Email、地址）');
                return;
            }

            // 將表單資料與購物車資料存到 localStorage
            const cartData = {
                items: this.products,
                totalQuantity: this.totalQuantity,
                totalPrice: this.totalPrice,
                shippingFee: this.shippingFee,
                grandTotal: this.grandTotal,
                paymentMethod: this.paymentMethod,
                deliveryMethod: this.deliveryMethod
            };
            localStorage.setItem('cartData', JSON.stringify(cartData));

            const userFormData = {
                name: this.formData.name,
                phone: this.formData.phone,
                email: this.formData.email,
                address1: this.formData.address1,
                address2: this.formData.address2,
                address: this.formData.address
            };
            localStorage.setItem('formData', JSON.stringify(userFormData));

            console.log('Form data saved to localStorage:', userFormData);
            console.log('Cart data saved to localStorage:', cartData);

            this.currentStep++;
        }
    }
}).mount('#app');