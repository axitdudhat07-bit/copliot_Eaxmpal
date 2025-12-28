'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import jsPDF from 'jspdf';
import Tesseract from 'tesseract.js';

export default function ImageTextToPDFConverter() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setSelectedImage(imageData);
        setExtractedText('');
        setProcessingStatus('');
      };
      reader.readAsDataURL(file);
    }
  };

  const extractTextFromImage = async () => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('Starting OCR processing...');

    try {
      setProcessingStatus('Initializing Tesseract...');
      const result = await Tesseract.recognize(selectedImage, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing') {
            const progress = Math.round(m.progress * 100);
            setProcessingStatus(`OCR Progress: ${progress}%`);
          }
        },
      });

      const text = result.data.text;
      setExtractedText(text);
      setProcessingStatus('Text extraction completed successfully!');
    } catch (error) {
      console.error('Error extracting text:', error);
      setProcessingStatus('Error during text extraction. Please try again.');
      alert('Failed to extract text from image. Please ensure the image is clear and readable.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generatePDF = () => {
    if (!extractedText.trim()) {
      alert('No extracted text available. Please extract text from an image first.');
      return;
    }

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const maxWidth = pageWidth - 2 * margin;

      // Split text into lines that fit the page width
      const lines = pdf.splitTextToSize(extractedText, maxWidth);

      let yPosition = margin;
      const lineHeight = 7;
      const maxLinesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight);

      lines.forEach((line, index) => {
        if (index > 0 && index % maxLinesPerPage === 0) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });

      pdf.save('extracted_text.pdf');
      setProcessingStatus('PDF generated and downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const downloadAsText = () => {
    if (!extractedText.trim()) {
      alert('No extracted text available.');
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([extractedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'extracted_text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearAll = () => {
    setSelectedImage(null);
    setExtractedText('');
    setProcessingStatus('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Image Text to PDF Converter
          </h1>
          <p className="text-gray-600 text-lg">
            Extract text from images using OCR and convert to PDF
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Image Upload Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Step 1: Upload Image
            </h2>
            <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center hover:border-indigo-500 transition cursor-pointer bg-indigo-50">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                disabled={isProcessing}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="text-indigo-600 hover:text-indigo-800 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Click to upload image or drag and drop
              </button>
              <p className="text-gray-500 text-sm mt-2">
                Supported formats: JPG, PNG, GIF, WebP
              </p>
            </div>
          </div>

          {/* Image Preview */}
          {selectedImage && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Image Preview
              </h3>
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={selectedImage}
                  alt="Uploaded image"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Extract Text Button */}
          {selectedImage && !extractedText && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Step 2: Extract Text
              </h2>
              <button
                onClick={extractTextFromImage}
                disabled={isProcessing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Extract Text from Image'}
              </button>
              {processingStatus && (
                <p className="text-center text-indigo-600 mt-4 font-semibold">
                  {processingStatus}
                </p>
              )}
            </div>
          )}

          {/* Extracted Text Section */}
          {extractedText && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Step 3: Extracted Text
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {extractedText}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {extractedText && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Step 4: Convert & Download
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={generatePDF}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  Download as PDF
                </button>
                <button
                  onClick={downloadAsText}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  Download as Text
                </button>
                <button
                  onClick={clearAll}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Status Message */}
          {processingStatus && extractedText && (
            <div className="text-center text-green-600 font-semibold">
              {processingStatus}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">🖼️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              OCR Technology
            </h3>
            <p className="text-gray-600">
              Advanced OCR engine to accurately extract text from any image
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">📄</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              PDF Generation
            </h3>
            <p className="text-gray-600">
              Convert extracted text to professional PDF documents
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Fast Processing
            </h3>
            <p className="text-gray-600">
              Quick and efficient text extraction with progress tracking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
