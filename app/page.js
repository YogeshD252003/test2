"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Users,
  BookOpen,
  Shield,
  Clock,
  MapPin,
  Zap,
  BarChart3,
  Smartphone,
  Cloud,
  ArrowRight,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: MapPin,
      title: "Geofencing Technology",
      description:
        "Automatic location-based attendance verification ensures students are physically present in the classroom.",
      color: "from-blue-400 to-cyan-400",
      stats: "99.8% Accuracy",
    },
    {
      icon: Shield,
      title: "Face Recognition",
      description:
        "Advanced biometric verification prevents proxy attendance and ensures accurate identification.",
      color: "from-purple-400 to-pink-400",
      stats: "100% Secure",
    },
    {
      icon: Clock,
      title: "Real-time Analytics",
      description:
        "Instant notifications and live attendance tracking keep everyone synchronized and informed.",
      color: "from-emerald-400 to-teal-400",
      stats: "Live Updates",
    },
    {
      icon: BarChart3,
      title: "Advanced Reporting",
      description:
        "Comprehensive analytics and detailed reports for better decision-making and insights.",
      color: "from-orange-400 to-red-400",
      stats: "Deep Insights",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description:
        "Fully responsive design that works seamlessly across all devices and platforms.",
      color: "from-violet-400 to-purple-400",
      stats: "Any Device",
    },
    {
      icon: Cloud,
      title: "Cloud Powered",
      description:
        "Secure cloud infrastructure ensuring data safety and accessibility from anywhere.",
      color: "from-amber-400 to-yellow-400",
      stats: "Always Available",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Navigation Bar */}
      <nav className="relative z-50 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  EduAttend
                </h1>
                <p className="text-xs text-gray-400">Smart System</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link
                href="/about"
                className="text-gray-300 hover:text-white transition-colors font-medium hover:scale-105 transform duration-200"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-gray-300 hover:text-white transition-colors font-medium hover:scale-105 transform duration-200"
              >
                Pricing
              </Link>

              {/* ✨ Admin Button */}
              <Link href="/admin-dashboard">
                <Button className="relative group bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg shadow-purple-500/25 text-white font-semibold rounded-full px-6 py-2 text-sm transition-all duration-300 border border-purple-400/20">
                  <span className="relative z-10 flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-300 group-hover:rotate-12 transition-transform" />
                    Admin
                  </span>
                  <span className="absolute inset-0 rounded-full bg-white/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                </Button>
              </Link>

              {/* Get Started Button */}
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-500/25 text-white font-semibold border border-blue-400/20">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700 shadow-lg mb-8">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-200">
                Trusted by 500+ institutions worldwide
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Smart{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Attendance
              </span>{" "}
              Revolution
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Next-generation attendance tracking with AI-powered geofencing,
              facial recognition, and real-time analytics. Transform your
              educational institution today.
            </p>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 mb-3 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 px-3 py-1 rounded-full inline-block border border-gray-600/50">
                    {feature.stats}
                  </div>
                </div>
              ))}
            </div>

            {/* Portal Selection */}
            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Teacher Portal */}
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative pb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-2xl shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-center text-white">
                    Teacher Portal
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative text-center">
                  <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                    Manage classes, track attendance, and access analytics in
                    real time.
                  </p>
                  <Link href="/teacher-login" className="w-full block">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-500/25 text-white font-semibold py-7 text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 border border-blue-400/20">
                      Access Teacher Portal
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Student Portal */}
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative pb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-2xl shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-center text-white">
                    Student Portal
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative text-center">
                  <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                    Mark attendance effortlessly using face recognition and
                    geofencing.
                  </p>
                  <Link href="/student-login" className="w-full block">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25 text-white font-semibold py-7 text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 border border-emerald-400/20">
                      Access Student Portal
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}