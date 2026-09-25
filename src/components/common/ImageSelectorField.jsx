'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Search, X, Check, Eye, Plus, Sparkles, FolderOpen } from 'lucide-react';
import { STATIC_IMAGES_MANIFEST } from '../../utils/databaseUploadSeeds';

/**
 * ImageSelectorField
 * A comprehensive image selection UI providing:
 * 1. "Choose from Gallery" (Modal picker showing all site gallery images & presets)
 * 2. "Upload from Device" (Direct file upload with auto-gallery registration)
 * 3. Live image preview & quick URL fallback
 */
export default function ImageSelectorField({
    value = '',
    onChange,
    onUploadAutoAddToGallery,
    label = 'ছবি (Image)',
    galleryItems = [],
    category = 'all',
    placeholder = '/images/... বা https://...',
    helperText = '',
    required = false,
}) {
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isUploading, setIsUploading] = useState(false);
    const [showManualUrl, setShowManualUrl] = useState(false);

    // Combine gallery items from active dataset + static preset manifest
    const staticItems = (STATIC_IMAGES_MANIFEST || []).map((s, idx) => ({
        id: `static-${idx}`,
        title: s.description || s.filename,
        url: s.path,
        category: s.category || 'general',
    }));

    const allAvailableImages = [
        ...(galleryItems || []).map((g, i) => ({
            id: g.id || `gal-item-${i}`,
            title: g.title || 'গ্যালারি আলোকচিত্র',
            url: g.url,
            category: g.category || 'events',
        })),
        ...staticItems,
    ];

    // Deduplicate by URL
    const uniqueImagesMap = new Map();
    allAvailableImages.forEach((img) => {
        if (img.url && !uniqueImagesMap.has(img.url)) {
            uniqueImagesMap.set(img.url, img);
        }
    });
    const uniqueImages = Array.from(uniqueImagesMap.values());

    // Filter gallery items based on search and category
    const filteredImages = uniqueImages.filter((img) => {
        const matchesCat =
            selectedCategory === 'all' ||
            img.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
            !searchTerm ||
            img.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            img.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            img.category?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCat && matchesSearch;
    });

    // Handle direct file upload from device
    const handleDeviceUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        // Immediate responsive preview using blob object URL
        let previewObjectUrl = null;
        try {
            previewObjectUrl = URL.createObjectURL(file);
            onChange(previewObjectUrl);
        } catch (objErr) {
            console.warn('Could not create object URL preview:', objErr);
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/files', {
                method: 'POST',
                body: formData,
            });
            const json = await res.json();
            if (json.success && json.url) {
                onChange(json.url);
                if (onUploadAutoAddToGallery) {
                    onUploadAutoAddToGallery(json.url, file);
                }
            } else {
                // If server file upload failed, convert to persistent base64 data URL
                const reader = new FileReader();
                reader.onload = (loadEvt) => {
                    const dataUrl = loadEvt.target?.result;
                    if (dataUrl) {
                        onChange(dataUrl);
                        if (onUploadAutoAddToGallery) {
                            onUploadAutoAddToGallery(dataUrl, file);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        } catch (err) {
            console.warn('Upload endpoint error, using data URL fallback:', err.message);
            // Fallback to base64 Data URL so the user's selected file always works
            const reader = new FileReader();
            reader.onload = (loadEvt) => {
                const dataUrl = loadEvt.target?.result;
                if (dataUrl) {
                    onChange(dataUrl);
                    if (onUploadAutoAddToGallery) {
                        onUploadAutoAddToGallery(dataUrl, file);
                    }
                }
            };
            reader.readAsDataURL(file);
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-2">
            {label && (
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700 flex items-center space-x-1.5">
                        <span>{label}</span>
                        {required && <span className="text-red-500">*</span>}
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowManualUrl(!showManualUrl)}
                        className="text-xs text-amber-700 hover:text-amber-900 font-semibold cursor-pointer underline"
                    >
                        {showManualUrl ? 'URL লুকান' : 'সরাসরি URL লিঙ্ক দিন'}
                    </button>
                </div>
            )}

            {/* Selected Image Preview & Control Box */}
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
                {value ? (
                    <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-md border border-stone-200">
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="w-12 h-12 shrink-0 rounded-md overflow-hidden bg-stone-100 border border-stone-200 relative group">
                                <img
                                    key={value}
                                    src={value}
                                    alt="Selected preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        if (!e.currentTarget.src.includes('/images/farming-collage.jpg')) {
                                            e.currentTarget.src = '/images/farming-collage.jpg';
                                        }
                                    }}
                                />
                            </div>
                            <div className="truncate">
                                <div className="text-xs font-semibold text-stone-800 truncate">{value}</div>
                                <div className="text-xs text-emerald-700 font-semibold flex items-center space-x-1 mt-0.5">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>ছবি সক্রিয় রয়েছে</span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded-md hover:bg-stone-100 shrink-0 cursor-pointer"
                            title="ছবি বাদ দিন"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="py-2 text-center text-xs text-stone-500">
                        কোনো ছবি এখনো নির্বাচন করা হয়নি
                    </div>
                )}

                {/* Action Choice Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Option 1: Choose from Gallery */}
                    <button
                        type="button"
                        onClick={() => setShowGalleryModal(true)}
                        className="flex items-center justify-center space-x-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold text-xs px-3.5 py-2 rounded-md transition-colors shadow-sm cursor-pointer"
                    >
                        <FolderOpen className="w-4 h-4 text-amber-700" />
                        <span>গ্যালারি থেকে নির্বাচন (Choose from Gallery)</span>
                    </button>

                    {/* Option 2: Upload from Device */}
                    <label className="flex items-center justify-center space-x-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-semibold text-xs px-3.5 py-2 rounded-md transition-colors shadow-sm cursor-pointer">
                        <Upload className="w-4 h-4 text-stone-600" />
                        <span>
                            {isUploading ? 'আপলোড হচ্ছে...' : 'ডিভাইস থেকে আপলোড (Upload)'}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            disabled={isUploading}
                            onChange={handleDeviceUpload}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Optional Manual URL Input */}
                {showManualUrl && (
                    <div className="pt-2 border-t border-stone-200">
                        <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700"
                        />
                    </div>
                )}

                {helperText && (
                    <p className="text-xs text-stone-500">{helperText}</p>
                )}
            </div>

            {/* GALLERY SELECTION MODAL */}
            {showGalleryModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
                    <div className="relative bg-white w-full max-w-4xl rounded-lg shadow-2xl border border-stone-200 p-5 space-y-4 max-h-[85vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                            <div className="flex items-center space-x-2">
                                <span className="bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-xs px-2.5 py-0.5 rounded-md flex items-center space-x-1">
                                    <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                                    <span>গ্যালারি ও লাইব্রেরি থেকে ছবি নির্বাচন করুন</span>
                                </span>
                                <span className="text-xs text-stone-500">
                                    ({filteredImages.length} টি ছবি উপলব্ধ)
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowGalleryModal(false)}
                                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Filter and Search Bar */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="ছবির নাম বা ক্যাটাগরি দিয়ে খুঁজুন..."
                                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700"
                                />
                            </div>

                            {/* Category Pills */}
                            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                                {[
                                    { id: 'all', label: 'সকল' },
                                    { id: 'farming', label: 'মাঠ ও কৃষি' },
                                    { id: 'education', label: 'শিক্ষা' },
                                    { id: 'events', label: 'উৎসব' },
                                    { id: 'branding', label: 'ব্র্যান্ডিং' },
                                    { id: 'archive', label: 'আর্কাইভ' },
                                ].map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                                            selectedCategory === cat.id
                                                ? 'bg-amber-700 text-white shadow-sm'
                                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Image Grid */}
                        <div className="flex-1 overflow-y-auto pr-1">
                            {filteredImages.length === 0 ? (
                                <div className="text-center py-12 text-stone-400 space-y-2">
                                    <ImageIcon className="w-10 h-10 mx-auto text-stone-300" />
                                    <p className="text-xs font-semibold">কোনো ছবি পাওয়া যায়নি</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {filteredImages.map((img) => {
                                        const isSelected = value === img.url;
                                        return (
                                            <div
                                                key={img.id}
                                                onClick={() => {
                                                    onChange(img.url);
                                                    setShowGalleryModal(false);
                                                }}
                                                className={`group relative rounded-lg overflow-hidden border cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? 'border-amber-700 ring-1 ring-amber-700'
                                                        : 'border-stone-200 hover:border-amber-700'
                                                }`}
                                            >
                                                <div className="aspect-square bg-stone-100 overflow-hidden relative">
                                                    <img
                                                        src={img.url}
                                                        alt={img.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/images/farming-collage.jpg';
                                                        }}
                                                    />
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 bg-amber-700 text-white rounded-full p-1 shadow-sm">
                                                            <Check className="w-3.5 h-3.5" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="bg-white text-stone-900 font-semibold text-xs px-2.5 py-1 rounded-md shadow-sm">
                                                            নির্বাচন করুন
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-2 bg-white border-t border-stone-100">
                                                    <div className="text-xs font-semibold text-stone-800 truncate" title={img.title}>
                                                        {img.title}
                                                    </div>
                                                    <div className="text-xs text-stone-500 truncate mt-0.5">
                                                        {img.category}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                            <span className="text-xs text-stone-500">
                                যেকোনো ছবির উপর ক্লিক করলে তা নির্বাচন হয়ে যাবে।
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowGalleryModal(false)}
                                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-md transition-colors cursor-pointer"
                            >
                                বন্ধ করুন
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
