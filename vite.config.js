import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import laravel from "laravel-vite-plugin";

export default defineConfig({
    plugins: [laravel(["resources/js/src/main.tsx"]), react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        watch: {
            // This explicitly tells Vite to ignore the app folder
            ignored: ['**/app/**'],
        },
    },
    build: {
        rollupOptions: {
            onwarn(warning, warn) {
                // This checks for the specific "use client" warning
                if (
                    warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
                    warning.message.includes('use client')
                ) {
                    return; // Ignore this warning
                }
                warn(warning); // Keep all other warnings
            },
            // Mark the module as 'external' to suppress the error
            external: [
                'react-router-dom',
                'react-apexcharts',
                '@fullcalendar/react',
                '@headlessui/react',
                'mantine-datatable',
                'lodash/sortBy',
                'react-quill',
                '@fullcalendar/daygrid',
                'react-sortablejs',
                '@fullcalendar/interaction',
                '@fullcalendar/timegrid',
                'react-quill/dist/quill.snow.css',
                '@tippyjs/react',
                'tippy.js/dist/tippy.css',
                'swiper/react',
                'swiper/css',
                'react-countup',
                'swiper/css/navigation',
                'swiper/css/pagination',
                'swiper',
                'react-18-image-lightbox',
                'react-18-image-lightbox/style.css',
                'react-click-away-listener',
                'react-export-table-to-excel',
                'yup',
                'react-text-mask',
                'formik',
                'react-select',
                'react-images-uploading',
                'react-simplemde-editor',
                'easymde/dist/easymde.min.css',
                'react-flatpickr',
                'flatpickr/dist/flatpickr.css',
                'react-copy-to-clipboard',
                '@x1mrdonut1x/nouislider-react',
                'nouislider/distribute/nouislider.css',
                'highlight.js/styles/monokai-sublime.css',
                'highlight.js',
                // Add the exact name of the missing package
                // Add any other packages you wish to ignore here
            ],
        },
    },
});
