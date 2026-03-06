import {
  PenTool, Image, Share2, Layout, FileText, Printer, Box, Shirt,
  Search, Facebook, Edit3, MessageCircle, BarChart, TrendingUp, Globe
} from 'lucide-react';

import React from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const IconMap: Record<string, React.ReactNode> = {
  PenTool: <PenTool size={24} />,
  Image: <Image size={24} />,
  Share2: <Share2 size={24} />,
  Layout: <Layout size={24} />,
  FileText: <FileText size={24} />,
  Printer: <Printer size={24} />,
  Box: <Box size={24} />,
  Shirt: <Shirt size={24} />,
  Search: <Search size={24} />,
  Facebook: <Facebook size={24} />,
  Edit3: <Edit3 size={24} />,
  MessageCircle: <MessageCircle size={24} />,
  BarChart: <BarChart size={24} />,
  TrendingUp: <TrendingUp size={24} />,
  Globe: <Globe size={24} />,
};

// Simple list for the Admin Dropdown
export const AvailableIcons = Object.keys(IconMap);