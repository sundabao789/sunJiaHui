'use client';

import React, { useState } from 'react';
import './globals.css';

type FormErrors = {
  mobile?: string;
  code?: string;
};

export default function Home() {
  const [mobile, setMobile] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isGettingCode, setIsGettingCode] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  const validateMobile = (value: string): string => {
    if (!value) return '请输入手机号';
    if (!/^1\d{10}$/.test(value)) return '手机号格式错误,请输入中国大陆11位手机号';
    return '';
  };

  const validateCode = (value: string): string => {
    if (!value) return '请输入验证码';
    if (!/^\d{6}$/.test(value)) return '验证码格式错误,请输入六位数字且正确验证码';
    return '';
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!mobile && !code) {
      alert('请输入手机号码和验证码');
      return;
    }
    const mobileError = validateMobile(mobile);
    const codeError = validateCode(code);

    if (mobileError || codeError) {
      setErrors({ mobile: mobileError, code: codeError });
      return;
    }

    const storedCode = localStorage.getItem('verificationCode');
    if (code !== storedCode) {
      setErrors({ code: '验证码错误，请重新输入' });
      return;
    }

    setErrors({});
    setSubmitting(true);
    setIsDialogOpen(true);

    setTimeout(() => {
      console.log('提交成功', { mobile, code });
      setSubmitting(false);
      localStorage.removeItem('verificationCode'); 
    }, 1000);
  };

  const getCode = async (): Promise<void> => {
    setIsGettingCode(true);
    try {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('verificationCode', generatedCode);
      console.log('生成的验证码为:', generatedCode);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
        if (countdown === 0) {
          clearInterval(timer);
        }
      }, 1000);
    } finally {
      setIsGettingCode(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md w-full max-w-md space-y-6 hover:shadow-xl transition-shadow">
        <div className="mb-4">
          <input
            placeholder="手机号"
            name="mobile"
            value={mobile}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMobile(e.target.value)}
            className="w-full p-3 border border-pink-300 rounded focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
          {errors.mobile && <p className="text-pink-500 text-sm mt-1">{errors.mobile}</p>}
        </div>

        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              placeholder="验证码"
              name="code"
              value={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
              className="flex-grow p-3 border border-pink-300 rounded-l focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
            <button
              type="button"
              className="bg-pink-500 text-white p-3 rounded-r hover:bg-pink-600 transition-colors cursor-pointer"
              disabled={!!validateMobile(mobile) || isGettingCode || countdown > 0}
              onClick={getCode}
            >
              {isGettingCode ? (
                <span className="animate-spin">&#9696;</span>
              ) : countdown > 0 ? (
                `${countdown}秒后重试`
              ) : (
                '获取验证码'
              )}
            </button>
          </div>
          {errors.code && <p className="text-pink-500 text-sm mt-1">{errors.code}</p>}
        </div>

        <button 
          type="submit" 
          className="w-full bg-pink-500 text-white p-3 rounded hover:bg-pink-600 transition-colors"
          disabled={submitting}
        >
          {submitting ? 'submitting......' : '登录'}
        </button>
      </form>
      {/* 优化后的提示弹窗 */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* 半透明背景遮罩，添加过渡效果 */}
          <div className="fixed inset-0 bg-gray-900 bg-opacity-60 transition-opacity duration-300"></div>
          <div className="bg-white p-8 rounded-2xl shadow-2xl z-10 transform transition-all duration-300 scale-100 animate-fade-in-down">
            {/* 标题样式优化 */}
            <h2 className="text-2xl font-extrabold text-pink-600 mb-4 text-center">🎉 提交成功</h2>
            {/* 内容样式优化 */}
            <p className="text-gray-700 text-lg text-center mb-6">登录成功</p>
            <div className="flex justify-center">
              <button 
                className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                onClick={() => setIsDialogOpen(false)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
