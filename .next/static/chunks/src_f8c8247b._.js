(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_f8c8247b._.js", {

"[project]/src/utils/axiosInstance.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const axiosInstance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: ("TURBOPACK compile-time value", "http://localhost:8080/api/v1"),
    headers: {
        "Content-Type": "application/json"
    }
});
const __TURBOPACK__default__export__ = axiosInstance;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/dashboard/admin/products/draft/[productId]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$axiosInstance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/axiosInstance.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fi/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const ProductDraftForm = ()=>{
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const productId = params?.productId;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [productData, setProductData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSubmitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fetchProductsData = async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$axiosInstance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/products/${productId}`);
            setProductData(response.data);
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };
    const fetchPictures = async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$axiosInstance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/pictures/${productId}`);
            console.log("Fetched pictures:", response.data);
            if (response.data.success) {
                const updatedPictures = response.data.data.length ? response.data.data.map((pic)=>pic.productPictureUrl) : [
                    null,
                    null,
                    null
                ]; // Set default values if no pictures
                // Only update the state if the pictures have changed
                if (JSON.stringify(updatedPictures) !== JSON.stringify(formik.values.productPictures)) {
                    formik.setFieldValue("productPictures", updatedPictures);
                }
            } else {
                console.error("Failed to fetch pictures:", response.data.message);
                formik.setFieldValue("productPictures", [
                    null,
                    null,
                    null
                ]); // Ensure empty array if no pictures found
            }
        } catch (error) {
            console.error("Error fetching pictures:", error);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductDraftForm.useEffect": ()=>{
            if (productId && !productData) {
                console.log("Fetching product data for ID:", productId);
                fetchProductsData();
            }
        }
    }["ProductDraftForm.useEffect"], [
        productId,
        productData
    ]); // Only fetch product data once
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductDraftForm.useEffect": ()=>{
            if (productData && !productData.pictures) {
                console.log("Fetching pictures for product...");
                fetchPictures(); // Fetch pictures after product data is available
            }
        }
    }["ProductDraftForm.useEffect"], [
        productData
    ]); // Only fetch pictures once productData is available
    const handleUploadPicture = async (position)=>{
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();
        input.onchange = async (event)=>{
            const file = event.target.files?.[0];
            if (!file) return;
            try {
                setSubmitting(true);
                const formData = new FormData();
                formData.append("file", file);
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$axiosInstance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/pictures/${productId}/${position}/upload`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Picture uploaded successfully!");
                fetchPictures(); // Fetch pictures after uploading
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to upload picture");
            } finally{
                setSubmitting(false);
            }
        };
    };
    const handleDeletePicture = async (position)=>{
        try {
            setSubmitting(true);
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$axiosInstance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/pictures/${productId}/${position}/delete`);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Picture deleted successfully!");
            fetchPictures(); // Fetch pictures after deleting
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Error deleting picture");
        } finally{
            setSubmitting(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 bg-white shadow-md rounded-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-3xl font-semibold mb-4",
                children: "📝 Edit Draft Product"
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/admin/products/draft/[productId]/page.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: "space-y-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-gray-700 font-semibold",
                            children: "Product Pictures"
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/admin/products/draft/[productId]/page.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2 md:flex-nowrap",
                            children: formik.values.productPictures.map((pic, position)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative w-24 h-24 border rounded flex items-center justify-center bg-gray-100",
                                    children: pic ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: pic,
                                                alt: `Product ${position + 1}`,
                                                className: "w-full h-full object-cover rounded"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/admin/products/draft/[productId]/page.tsx",
                                                lineNumber: 119,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: `absolute top-1 right-1 p-1 text-white rounded-full transition ${isSubmitting ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`,
                                                onClick: ()=>handleDeletePicture(position + 1),
                                                disabled: isSubmitting,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiTrash"], {
                                                    className: "w-5 h-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/admin/products/draft/[productId]/page.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/admin/products/draft/[productId]/page.tsx",
                                                lineNumber: 124,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `absolute top-1 right-1 p-1 text-gray-700 rounded-full transition ${isSubmitting ? "bg-gray-300 cursor-not-allowed" : "bg-gray-300 hover:bg-gray-400"}`,
                                        onClick: ()=>handleUploadPicture(position + 1),
                                        disabled: isSubmitting,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiUploadCloud"], {
                                            className: "w-6 h-6"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/admin/products/draft/[productId]/page.tsx",
                                            lineNumber: 144,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/admin/products/draft/[productId]/page.tsx",
                                        lineNumber: 136,
                                        columnNumber: 19
                                    }, this)
                                }, position, false, {
                                    fileName: "[project]/src/app/dashboard/admin/products/draft/[productId]/page.tsx",
                                    lineNumber: 116,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/admin/products/draft/[productId]/page.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/admin/products/draft/[productId]/page.tsx",
                    lineNumber: 112,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/admin/products/draft/[productId]/page.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/admin/products/draft/[productId]/page.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
};
_s(ProductDraftForm, "2AFmDEMEPLaoYHraPLL1eij3DcM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ProductDraftForm;
const __TURBOPACK__default__export__ = ProductDraftForm;
var _c;
__turbopack_context__.k.register(_c, "ProductDraftForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_f8c8247b._.js.map