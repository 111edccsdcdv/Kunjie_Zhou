'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { HiOutlineArrowLeft, HiOutlineBell, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import Image from "next/image";
import { useRouter } from 'next/navigation';
// @ts-ignore
import { PieChart, Pie, Cell } from "recharts";
import { ArrowLeft } from 'lucide-react';

// 定义家长阅读详情的接口
interface ParentEntry {
  id: number;
  parentName: string;
  childName: string;
  read: boolean; // true for '已读', false for '未读'
  readTime: string; // Format 'YYYY-MM-DD HH:MM', empty string if not read
  remark: string; // User-editable remark
}

// 定义通知详情的接口
interface NotificationDetailType {
  title: string;
  content: string;
  date: string; // 添加通知日期
  stats: { total: number; read: number; unread: number };
  parentList: ParentEntry[]; // 统一的家长列表
}

// 假数据 - 为了演示，我们将根据ID提供模拟数据
const mockNotificationDetails: Record<string, NotificationDetailType> = {
  'n1': {
    title: "关于2024年春季运动会安排的通知",
    content: "亲爱的同学们、家长们，2024年春季运动会将于5月15日隆重举行。请各位同学积极报名参加各项比赛，展现青春风采！",
  date: "2024-05-01 09:00",
    stats: { total: 50, read: 40, unread: 10 },
    parentList: [
      { id: 1, parentName: '张三', childName: '小明', read: true, readTime: '2024-05-01 10:12', remark: '' },
      { id: 2, parentName: '李四', childName: '小红', read: true, readTime: '2024-05-01 10:15', remark: '' },
      { id: 3, parentName: '王二', childName: '小刚', read: true, readTime: '2024-05-01 10:18', remark: '' },
      { id: 4, parentName: '赵大', childName: '小丽', read: true, readTime: '2024-05-01 10:20', remark: '' },
      { id: 5, parentName: '钱小', childName: '小华', read: true, readTime: '2024-05-01 10:22', remark: '' },
      { id: 6, parentName: '孙大', childName: '小强', read: true, readTime: '2024-05-01 10:25', remark: '' },
      { id: 7, parentName: '周五', childName: '小芳', read: true, readTime: '2024-05-01 10:28', remark: '' },
      { id: 8, parentName: '吴六', childName: '小斌', read: true, readTime: '2024-05-01 10:30', remark: '' },
      { id: 9, parentName: '郑七', childName: '小美', read: true, readTime: '2024-05-01 10:32', remark: '' },
      { id: 10, parentName: '冯八', childName: '小杰', read: true, readTime: '2024-05-01 10:35', remark: '' },
      { id: 11, parentName: '陈九', childName: '小璐', read: true, readTime: '2024-05-01 10:38', remark: '' },
      { id: 12, parentName: '褚十', childName: '小凯', read: true, readTime: '2024-05-01 10:40', remark: '' },
      { id: 13, parentName: '卫一', childName: '小燕', read: true, readTime: '2024-05-01 10:42', remark: '' },
      { id: 14, parentName: '蒋二', childName: '小军', read: true, readTime: '2024-05-01 10:45', remark: '' },
      { id: 15, parentName: '沈三', childName: '小琴', read: true, readTime: '2024-05-01 10:48', remark: '' },
      { id: 16, parentName: '韩四', childName: '小兵', read: true, readTime: '2024-05-01 10:50', remark: '' },
      { id: 17, parentName: '杨五', childName: '小敏', read: true, readTime: '2024-05-01 10:52', remark: '' },
      { id: 18, parentName: '朱六', childName: '小莉', read: true, readTime: '2024-05-01 10:55', remark: '' },
      { id: 19, parentName: '秦七', childName: '小涛', read: true, readTime: '2024-05-01 10:58', remark: '' },
      { id: 20, parentName: '尤八', childName: '小霞', read: true, readTime: '2024-05-01 11:00', remark: '' },
      { id: 21, parentName: '许九', childName: '小宇', read: true, readTime: '2024-05-01 11:02', remark: '' },
      { id: 22, parentName: '何十', childName: '小娜', read: true, readTime: '2024-05-01 11:05', remark: '' },
      { id: 23, parentName: '吕一', childName: '小飞', read: true, readTime: '2024-05-01 11:08', remark: '' },
      { id: 24, parentName: '施二', childName: '小静', read: true, readTime: '2024-05-01 11:10', remark: '' },
      { id: 25, parentName: '张三丰', childName: '小仙', read: true, readTime: '2024-05-01 11:12', remark: '' },
      { id: 26, parentName: '李四光', childName: '小文', read: true, readTime: '2024-05-01 11:15', remark: '' },
      { id: 27, parentName: '王五二', childName: '小武', read: true, readTime: '2024-05-01 11:18', remark: '' },
      { id: 28, parentName: '赵六七', childName: '小莉', read: true, readTime: '2024-05-01 11:20', remark: '' },
      { id: 29, parentName: '钱小明', childName: '小刚', read: true, readTime: '2024-05-01 11:22', remark: '' },
      { id: 30, parentName: '孙大圣', childName: '小美', read: true, readTime: '2024-05-01 11:25', remark: '' },
      { id: 31, parentName: '周武王', childName: '小兵', read: true, readTime: '2024-05-01 11:28', remark: '' },
      { id: 32, parentName: '吴道子', childName: '小华', read: true, readTime: '2024-05-01 11:30', remark: '' },
      { id: 33, parentName: '郑成功', childName: '小强', read: true, readTime: '2024-05-01 11:32', remark: '' },
      { id: 34, parentName: '冯友兰', childName: '小芳', read: true, readTime: '2024-05-01 11:35', remark: '' },
      { id: 35, parentName: '陈独秀', childName: '小斌', read: true, readTime: '2024-05-01 11:38', remark: '' },
      { id: 36, parentName: '褚时健', childName: '小红', read: true, readTime: '2024-05-01 11:40', remark: '' },
      { id: 37, parentName: '卫青', childName: '小明', read: true, readTime: '2024-05-01 11:42', remark: '' },
      { id: 38, parentName: '蒋介石', childName: '小丽', read: true, readTime: '2024-05-01 11:45', remark: '' },
      { id: 39, parentName: '沈从文', childName: '小刚', read: true, readTime: '2024-05-01 11:48', remark: '' },
      { id: 40, parentName: '韩信', childName: '小华', read: true, readTime: '2024-05-01 11:50', remark: '' },
      { id: 41, parentName: '王五', childName: '小天', read: false, readTime: '', remark: '' },
      { id: 42, parentName: '赵六', childName: '小地', read: false, readTime: '', remark: '' },
      { id: 43, parentName: '李七', childName: '小玄', read: false, readTime: '', remark: '' },
      { id: 44, parentName: '张八', childName: '小黄', read: false, readTime: '', remark: '' },
      { id: 45, parentName: '刘九', childName: '小宇', read: false, readTime: '', remark: '' },
      { id: 46, parentName: '陈十', childName: '小宙', read: false, readTime: '', remark: '' },
      { id: 47, parentName: '杨一', childName: '小洪', read: false, readTime: '', remark: '' },
      { id: 48, parentName: '黄二', childName: '小荒', read: false, readTime: '', remark: '' },
      { id: 49, parentName: '吴三', childName: '小宇', read: false, readTime: '', remark: '' },
      { id: 50, parentName: '周四', childName: '小宙', read: false, readTime: '', remark: '' },
    ],
  },
  'n2': {
    title: "庆祝六一儿童节文艺汇演报名通知",
    content: "为庆祝六一儿童节，学校将举办文艺汇演。现面向全体学生征集节目，欢迎大家踊跃报名，展现才艺！",
    date: "2024-06-01 10:00",
    stats: { total: 45, read: 25, unread: 20 },
    parentList: [
      { id: 51, parentName: '小明', childName: '小丽', read: true, readTime: '2024-06-01 09:00', remark: '' },
      { id: 52, parentName: '小红', childName: '小华', read: true, readTime: '2024-06-01 09:05', remark: '' },
      { id: 53, parentName: '小白', childName: '小强', read: true, readTime: '2024-06-01 09:10', remark: '' },
      { id: 54, parentName: '小绿', childName: '小美', read: true, readTime: '2024-06-01 09:15', remark: '' },
      { id: 55, parentName: '小黄', childName: '小兵', read: true, readTime: '2024-06-01 09:20', remark: '' },
      { id: 56, parentName: '小紫', childName: '小芳', read: true, readTime: '2024-06-01 09:25', remark: '' },
      { id: 57, parentName: '小橙', childName: '小斌', read: true, readTime: '2024-06-01 09:30', remark: '' },
      { id: 58, parentName: '小青', childName: '小杰', read: true, readTime: '2024-06-01 09:35', remark: '' },
      { id: 59, parentName: '小蓝', childName: '小璐', read: true, readTime: '2024-06-01 09:40', remark: '' },
      { id: 60, parentName: '小黑', childName: '小凯', read: true, readTime: '2024-06-01 09:45', remark: '' },
      { id: 61, parentName: '小灰', childName: '小燕', read: true, readTime: '2024-06-01 09:50', remark: '' },
      { id: 62, parentName: '小棕', childName: '小军', read: true, readTime: '2024-06-01 09:55', remark: '' },
      { id: 63, parentName: '小金', childName: '小琴', read: true, readTime: '2024-06-01 10:00', remark: '' },
      { id: 64, parentName: '小银', childName: '小兵', read: true, readTime: '2024-06-01 10:05', remark: '' },
      { id: 65, parentName: '小铜', childName: '小敏', read: true, readTime: '2024-06-01 10:10', remark: '' },
      { id: 66, parentName: '小铁', childName: '小莉', read: true, readTime: '2024-06-01 10:15', remark: '' },
      { id: 67, parentName: '小石', childName: '小涛', read: true, readTime: '2024-06-01 10:20', remark: '' },
      { id: 68, parentName: '小木', childName: '小霞', read: true, readTime: '2024-06-01 10:25', remark: '' },
      { id: 69, parentName: '小水', childName: '小宇', read: true, readTime: '2024-06-01 10:30', remark: '' },
      { id: 70, parentName: '小火', childName: '小娜', read: true, readTime: '2024-06-01 10:35', remark: '' },
      { id: 71, parentName: '小土', childName: '小飞', read: true, readTime: '2024-06-01 10:40', remark: '' },
      { id: 72, parentName: '小风', childName: '小静', read: true, readTime: '2024-06-01 10:45', remark: '' },
      { id: 73, parentName: '小雨', childName: '小仙', read: true, readTime: '2024-06-01 10:50', remark: '' },
      { id: 74, parentName: '小雷', childName: '小文', read: true, readTime: '2024-06-01 10:55', remark: '' },
      { id: 75, parentName: '小电', childName: '小武', read: true, readTime: '2024-06-01 11:00', remark: '' },
      { id: 76, parentName: '小强', childName: '小天', read: false, readTime: '', remark: '' },
      { id: 77, parentName: '小花', childName: '小地', read: false, readTime: '', remark: '' },
      { id: 78, parentName: '小草', childName: '小玄', read: false, readTime: '', remark: '' },
      { id: 79, parentName: '小树', childName: '小黄', read: false, readTime: '', remark: '' },
      { id: 80, parentName: '小鸟', childName: '小宇', read: false, readTime: '', remark: '' },
      { id: 81, parentName: '小鱼', childName: '小宙', read: false, readTime: '', remark: '' },
      { id: 82, parentName: '小虫', childName: '小洪', read: false, readTime: '', remark: '' },
      { id: 83, parentName: '小虾', childName: '小荒', read: false, readTime: '', remark: '' },
      { id: 84, parentName: '小蟹', childName: '小宇', read: false, readTime: '', remark: '' },
      { id: 85, parentName: '小贝', childName: '小宙', read: false, readTime: '', remark: '' },
      { id: 86, parentName: '小龙', childName: '小天', read: false, readTime: '', remark: '' },
      { id: 87, parentName: '小虎', childName: '小地', read: false, readTime: '', remark: '' },
      { id: 88, parentName: '小熊', childName: '小玄', read: false, readTime: '', remark: '' },
      { id: 89, parentName: '小鹿', childName: '小黄', read: false, readTime: '', remark: '' },
      { id: 90, parentName: '小兔', childName: '小宇', read: false, readTime: '', remark: '' },
      { id: 91, parentName: '小狗', childName: '小宙', read: false, readTime: '', remark: '' },
      { id: 92, parentName: '小猫', childName: '小洪', read: false, readTime: '', remark: '' },
      { id: 93, parentName: '小鼠', childName: '小荒', read: false, readTime: '', remark: '' },
      { id: 94, parentName: '小牛', childName: '小宇', read: false, readTime: '', remark: '' },
      { id: 95, parentName: '小羊', childName: '小宙', read: false, readTime: '', remark: '' },
    ],
  },
  'n3': {
    title: "学校科技节创新作品征集通知",
    content: "一年一度的学校科技节即将启动，特向全体师生征集创新作品。请大家发挥想象力，提交您的奇思妙想和实践成果！",
    date: "2024-04-10 14:00",
    stats: { total: 30, read: 20, unread: 10 },
    parentList: [
      { id: 96, parentName: '张华', childName: '小玲', read: true, readTime: '2024-04-10 14:30', remark: '' },
      { id: 97, parentName: '李娜', childName: '小勇', read: true, readTime: '2024-04-10 14:35', remark: '' },
      { id: 98, parentName: '王伟', childName: '小红', read: true, readTime: '2024-04-10 14:40', remark: '' },
      { id: 99, parentName: '赵丽', childName: '小明', read: true, readTime: '2024-04-10 14:45', remark: '' },
      { id: 100, parentName: '钱刚', childName: '小丽', read: true, readTime: '2024-04-10 14:50', remark: '' },
      { id: 101, parentName: '孙鹏', childName: '小华', read: true, readTime: '2024-04-10 14:55', remark: '' },
      { id: 102, parentName: '周勇', childName: '小强', read: true, readTime: '2024-04-10 15:00', remark: '' },
      { id: 103, parentName: '吴斌', childName: '小美', read: true, readTime: '2024-04-10 15:05', remark: '' },
      { id: 104, parentName: '郑强', childName: '小兵', read: true, readTime: '2024-04-10 15:10', remark: '' },
      { id: 105, parentName: '冯敏', childName: '小芳', read: true, readTime: '2024-04-10 15:15', remark: '' },
      { id: 106, parentName: '陈涛', childName: '小斌', read: true, readTime: '2024-04-10 15:20', remark: '' },
      { id: 107, parentName: '褚亮', childName: '小杰', read: true, readTime: '2024-04-10 15:25', remark: '' },
      { id: 108, parentName: '卫东', childName: '小璐', read: true, readTime: '2024-04-10 15:30', remark: '' },
      { id: 109, parentName: '蒋丽', childName: '小凯', read: true, readTime: '2024-04-10 15:35', remark: '' },
      { id: 110, parentName: '沈静', childName: '小燕', read: true, readTime: '2024-04-10 15:40', remark: '' },
      { id: 111, parentName: '韩梅', childName: '小军', read: true, readTime: '2024-04-10 15:45', remark: '' },
      { id: 112, parentName: '杨柳', childName: '小琴', read: true, readTime: '2024-04-10 15:50', remark: '' },
      { id: 113, parentName: '朱芳', childName: '小兵', read: true, readTime: '2024-04-10 15:55', remark: '' },
      { id: 114, parentName: '秦岚', childName: '小敏', read: true, readTime: '2024-04-10 16:00', remark: '' },
      { id: 115, parentName: '尤娜', childName: '小莉', read: true, readTime: '2024-04-10 16:05', remark: '' },
      { id: 116, parentName: '王伟', childName: '小涛', read: false, readTime: '', remark: '' },
      { id: 117, parentName: '赵丽', childName: '小霞', read: false, readTime: '', remark: '' },
      { id: 118, parentName: '张三', childName: '小宇', read: false, readTime: '', remark: '' },
      { id: 119, parentName: '李四', childName: '小娜', read: false, readTime: '', remark: '' },
      { id: 120, parentName: '王五', childName: '小飞', read: false, readTime: '', remark: '' },
      { id: 121, parentName: '赵六', childName: '小静', read: false, readTime: '', remark: '' },
      { id: 122, parentName: '孙七', childName: '小仙', read: false, readTime: '', remark: '' },
      { id: 123, parentName: '周八', childName: '小文', read: false, readTime: '', remark: '' },
      { id: 124, parentName: '吴九', childName: '小武', read: false, readTime: '', remark: '' },
      { id: 125, parentName: '郑十', childName: '小莉', read: false, readTime: '', remark: '' },
    ],
  },
  'n4': {
    title: "寒假社会实践活动总结大会通知",
    content: "各位参与寒假社会实践的同学，总结大会定于4月28日举行，请准备好您的实践报告和心得体会。",
    date: "2024-04-20 16:00",
    stats: { total: 35, read: 30, unread: 5 },
    parentList: [
      { id: 126, parentName: '王明', childName: '小红', read: true, readTime: '2024-04-20 16:30', remark: '' },
      { id: 127, parentName: '赵芳', childName: '小明', read: true, readTime: '2024-04-20 16:35', remark: '' },
      { id: 128, parentName: '孙悦', childName: '小丽', read: true, readTime: '2024-04-20 16:40', remark: '' },
      { id: 129, parentName: '李磊', childName: '小华', read: true, readTime: '2024-04-20 16:45', remark: '' },
      { id: 130, parentName: '张勇', childName: '小强', read: true, readTime: '2024-04-20 16:50', remark: '' },
      { id: 131, parentName: '刘洋', childName: '小美', read: true, readTime: '2024-04-20 16:55', remark: '' },
      { id: 132, parentName: '陈晨', childName: '小兵', read: true, readTime: '2024-04-20 17:00', remark: '' },
      { id: 133, parentName: '杨帆', childName: '小芳', read: true, readTime: '2024-04-20 17:05', remark: '' },
      { id: 134, parentName: '黄海', childName: '小斌', read: true, readTime: '2024-04-20 17:10', remark: '' },
      { id: 135, parentName: '吴刚', childName: '小杰', read: true, readTime: '2024-04-20 17:15', remark: '' },
      { id: 136, parentName: '周平', childName: '小璐', read: true, readTime: '2024-04-20 17:20', remark: '' },
      { id: 137, parentName: '郑飞', childName: '小凯', read: true, readTime: '2024-04-20 17:25', remark: '' },
      { id: 138, parentName: '冯林', childName: '小燕', read: true, readTime: '2024-04-20 17:30', remark: '' },
      { id: 139, parentName: '陈华', childName: '小军', read: true, readTime: '2024-04-20 17:35', remark: '' },
      { id: 140, parentName: '褚军', childName: '小琴', read: true, readTime: '2024-04-20 17:40', remark: '' },
      { id: 141, parentName: '卫红', childName: '小兵', read: true, readTime: '2024-04-20 17:45', remark: '' },
      { id: 142, parentName: '蒋力', childName: '小敏', read: true, readTime: '2024-04-20 17:50', remark: '' },
      { id: 143, parentName: '沈伟', childName: '小莉', read: true, readTime: '2024-04-20 17:55', remark: '' },
      { id: 144, parentName: '韩涛', childName: '小涛', read: true, readTime: '2024-04-20 18:00', remark: '' },
      { id: 145, parentName: '杨光', childName: '小霞', read: true, readTime: '2024-04-20 18:05', remark: '' },
      { id: 146, parentName: '朱强', childName: '小宇', read: true, readTime: '2024-04-20 18:10', remark: '' },
      { id: 147, parentName: '秦明', childName: '小娜', read: true, readTime: '2024-04-20 18:15', remark: '' },
      { id: 148, parentName: '尤力', childName: '小飞', read: true, readTime: '2024-04-20 18:20', remark: '' },
      { id: 149, parentName: '许辉', childName: '小静', read: true, readTime: '2024-04-20 18:25', remark: '' },
      { id: 150, parentName: '何刚', childName: '小仙', read: true, readTime: '2024-04-20 18:30', remark: '' },
      { id: 151, parentName: '吕伟', childName: '小文', read: true, readTime: '2024-04-20 18:35', remark: '' },
      { id: 152, parentName: '施强', childName: '小武', read: true, readTime: '2024-04-20 18:40', remark: '' },
      { id: 153, parentName: '张刚', childName: '小莉', read: true, readTime: '2024-04-20 18:45', remark: '' },
      { id: 154, parentName: '李华', childName: '小刚', read: true, readTime: '2024-04-20 18:50', remark: '' },
      { id: 155, parentName: '王军', childName: '小美', read: true, readTime: '2024-04-20 18:55', remark: '' },
      { id: 156, parentName: '孙悦', childName: '小天', read: false, readTime: '', remark: '' },
      { id: 157, parentName: '李磊', childName: '小地', read: false, readTime: '', remark: '' },
      { id: 158, parentName: '张勇', childName: '小玄', read: false, readTime: '', remark: '' },
      { id: 159, parentName: '刘洋', childName: '小黄', read: false, readTime: '', remark: '' },
      { id: 160, parentName: '陈晨', childName: '小宇', read: false, readTime: '', remark: '' },
    ],
  },
  'n5': {
    title: "青少年情绪管理与压力应对讲座",
    content: "特邀心理专家为青少年举办情绪管理与压力应对讲座，旨在帮助学生更好地面对学业和生活中的挑战。",
    date: "2024-03-25 19:00",
    stats: { total: 60, read: 50, unread: 10 },
    parentList: [
      { id: 161, parentName: '陈洁', childName: '小明', read: true, readTime: '2024-03-25 19:30', remark: '' },
      { id: 162, parentName: '孙强', childName: '小红', read: true, readTime: '2024-03-25 19:35', remark: '' },
      { id: 163, parentName: '周杰', childName: '小刚', read: true, readTime: '2024-03-25 19:40', remark: '' },
      { id: 164, parentName: '吴迪', childName: '小丽', read: true, readTime: '2024-03-25 19:45', remark: '' },
      { id: 165, parentName: '郑爽', childName: '小华', read: true, readTime: '2024-03-25 19:50', remark: '' },
      { id: 166, parentName: '冯巩', childName: '小强', read: true, readTime: '2024-03-25 19:55', remark: '' },
      { id: 167, parentName: '陈佩斯', childName: '小美', read: true, readTime: '2024-03-25 20:00', remark: '' },
      { id: 168, parentName: '朱时茂', childName: '小兵', read: true, readTime: '2024-03-25 20:05', remark: '' },
      { id: 169, parentName: '秦昊', childName: '小芳', read: true, readTime: '2024-03-25 20:10', remark: '' },
      { id: 170, parentName: '尤长靖', childName: '小斌', read: true, readTime: '2024-03-25 20:15', remark: '' },
      { id: 171, parentName: '许魏洲', childName: '小杰', read: true, readTime: '2024-03-25 20:20', remark: '' },
      { id: 172, parentName: '何洛洛', childName: '小璐', read: true, readTime: '2024-03-25 20:25', remark: '' },
      { id: 173, parentName: '吕思聪', childName: '小凯', read: true, readTime: '2024-03-25 20:30', remark: '' },
      { id: 174, parentName: '施展', childName: '小燕', read: true, readTime: '2024-03-25 20:35', remark: '' },
      { id: 175, parentName: '张颜齐', childName: '小军', read: true, readTime: '2024-03-25 20:40', remark: '' },
      { id: 176, parentName: '李汶翰', childName: '小琴', read: true, readTime: '2024-03-25 20:45', remark: '' },
      { id: 177, parentName: '王一博', childName: '小兵', read: true, readTime: '2024-03-25 20:50', remark: '' },
      { id: 178, parentName: '赵丽颖', childName: '小敏', read: true, readTime: '2024-03-25 20:55', remark: '' },
      { id: 179, parentName: '钱枫', childName: '小莉', read: true, readTime: '2024-03-25 21:00', remark: '' },
      { id: 180, parentName: '孙俪', childName: '小涛', read: true, readTime: '2024-03-25 21:05', remark: '' },
      { id: 181, parentName: '周冬雨', childName: '小霞', read: true, readTime: '2024-03-25 21:10', remark: '' },
      { id: 182, parentName: '吴亦凡', childName: '小宇', read: true, readTime: '2024-03-25 21:15', remark: '' },
      { id: 183, parentName: '郑恺', childName: '小娜', read: true, readTime: '2024-03-25 21:20', remark: '' },
      { id: 184, parentName: '冯绍峰', childName: '小飞', read: true, readTime: '2024-03-25 21:25', remark: '' },
      { id: 185, parentName: '陈伟霆', childName: '小静', read: true, readTime: '2024-03-25 21:30', remark: '' },
      { id: 186, parentName: '褚赢', childName: '小仙', read: true, readTime: '2024-03-25 21:35', remark: '' },
      { id: 187, parentName: '卫龙', childName: '小文', read: true, readTime: '2024-03-25 21:40', remark: '' },
      { id: 188, parentName: '蒋依依', childName: '小武', read: true, readTime: '2024-03-25 21:45', remark: '' },
      { id: 189, parentName: '沈月', childName: '小莉', read: true, readTime: '2024-03-25 21:50', remark: '' },
      { id: 190, parentName: '韩东君', childName: '小刚', read: true, readTime: '2024-03-25 21:55', remark: '' },
      { id: 191, parentName: '杨幂', childName: '小美', read: true, readTime: '2024-03-25 22:00', remark: '' },
      { id: 192, parentName: '朱一龙', childName: '小兵', read: true, readTime: '2024-03-25 22:05', remark: '' },
      { id: 193, parentName: '秦海璐', childName: '小芳', read: true, readTime: '2024-03-25 22:10', remark: '' },
      { id: 194, parentName: '尤浩然', childName: '小斌', read: true, readTime: '2024-03-25 22:15', remark: '' },
      { id: 195, parentName: '许凯', childName: '小杰', read: true, readTime: '2024-03-25 22:20', remark: '' },
      { id: 196, parentName: '何炅', childName: '小璐', read: true, readTime: '2024-03-25 22:25', remark: '' },
      { id: 197, parentName: '吕一', childName: '小凯', read: true, readTime: '2024-03-25 22:30', remark: '' },
      { id: 198, parentName: '施诗', childName: '小燕', read: true, readTime: '2024-03-25 22:35', remark: '' },
      { id: 199, parentName: '张杰', childName: '小军', read: true, readTime: '2024-03-25 22:40', remark: '' },
      { id: 200, parentName: '李易峰', childName: '小琴', read: true, readTime: '2024-03-25 22:45', remark: '' },
      { id: 201, parentName: '王俊凯', childName: '小兵', read: true, readTime: '2024-03-25 22:50', remark: '' },
      { id: 202, parentName: '赵本山', childName: '小敏', read: true, readTime: '2024-03-25 22:55', remark: '' },
      { id: 203, parentName: '钱枫', childName: '小莉', read: true, readTime: '2024-03-25 23:00', remark: '' },
      { id: 204, parentName: '孙红雷', childName: '小涛', read: true, readTime: '2024-03-25 23:05', remark: '' },
      { id: 205, parentName: '周深', childName: '小霞', read: true, readTime: '2024-03-25 23:10', remark: '' },
      { id: 206, parentName: '周杰', childName: '小天', read: false, readTime: '', remark: '' },
      { id: 207, parentName: '吴迪', childName: '小地', read: false, readTime: '', remark: '' },
      { id: 208, parentName: '郑爽', childName: '小玄', read: false, readTime: '', remark: '' },
      { id: 209, parentName: '冯巩', childName: '小黄', read: false, readTime: '', remark: '' },
      { id: 210, parentName: '陈佩斯', childName: '小宇', read: false, readTime: '', remark: '' },
      { id: 211, parentName: '朱时茂', childName: '小宙', read: false, readTime: '', remark: '' },
      { id: 212, parentName: '秦昊', childName: '小洪', read: false, readTime: '', remark: '' },
      { id: 213, parentName: '尤长靖', childName: '小荒', read: false, readTime: '', remark: '' },
      { id: 214, parentName: '许魏洲', childName: '小宇', read: false, readTime: '', remark: '' },
      { id: 215, parentName: '何洛洛', childName: '小宙', read: false, readTime: '', remark: '' },
    ],
  },
};

const donutColors = ["#4F8CFF", "#E3E8F0"];

export default function NotificationDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [notification, setNotification] = useState<NotificationDetailType | null>(null);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [parentsData, setParentsData] = useState<ParentEntry[]>([]); // 用于表格显示的家长数据
  const [reminded, setReminded] = useState<number[]>([]); // 记录已提醒的家长ID

  useEffect(() => {
    // 模拟数据获取
    const data = mockNotificationDetails[id];
    if (data) {
      setNotification(data);
      // 初始化家长数据
      setParentsData(data.parentList);
      // 清空提醒状态，防止跨通知残留
      setReminded([]);
    } else {
      // 处理未找到通知的情况，例如重定向或显示错误
      router.push('/notification-tracker'); // 返回列表页
    }
  }, [id, router]);

  // 筛选家长数据
  const filteredParents = parentsData.filter(p => {
    if (filter === 'read') return p.read;
    if (filter === 'unread') return !p.read;
    return true; // 'all'
  });

  // 批量提醒未读家长
  const handleBatchRemind = () => {
    const unreadParents = parentsData.filter(p => !p.read && !reminded.includes(p.id));
    const newRemindedIds = unreadParents.map(p => p.id);
    setReminded(prev => [...prev, ...newRemindedIds]);
    // TODO: 后端接口调用 (对接QQ群中的CA)
    console.log("Batch reminding unread parents:", unreadParents.map(p => p.parentName));
  };

  // 单独提醒家长
  const handleRemind = (parentId: number) => {
    setReminded(prev => [...prev, parentId]);
    // TODO: 后端接口调用 (对接QQ群中的CA)
    const parentToRemind = parentsData.find(p => p.id === parentId);
    if (parentToRemind) {
      console.log("Reminding parent:", parentToRemind.parentName);
    }
  };

  // 更新家长备注
  const handleRemark = (parentId: number, newRemark: string) => {
    setParentsData(prevParents =>
      prevParents.map(p =>
        p.id === parentId ? { ...p, remark: newRemark } : p
      )
    );
    // TODO: 后端接口调用 (对接QQ群中的CA)
    console.log(`Updated remark for parent ${parentId} to: ${newRemark}`);
  };

  if (!notification) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>加载中...</p>
      </div>
    );
  }

  const donutData = [
    { name: "已读", value: notification.stats.read },
    { name: "未读", value: notification.stats.unread },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* 顶部导航栏 */}
      <nav className="relative z-10 flex items-center justify-between bg-white/40 backdrop-blur-2xl border-b border-blue-100 px-8 py-4 mt-6 mb-8 shadow-lg rounded-[2.5rem] min-h-[72px] ring-2 ring-white/40 max-w-7xl w-full mx-auto" style={{boxShadow:'0 4px 32px 0 rgba(31,38,135,0.18),0 0 24px 2px #fff6,0 0 0 2px #fff4 inset',backdropFilter:'blur(24px)'}}>
        <div className="absolute left-8 flex items-center gap-2">
          <button onClick={() => router.back()} className="text-blue-900 hover:text-blue-600 transition flex items-center gap-1">
            <ArrowLeft className="w-5 h-5" /> 返回
          </button>
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-blue-900 tracking-wide select-none drop-shadow text-center"
          style={{ fontFamily: `'Quicksand', 'Nunito', 'Noto Sans Rounded', 'Noto Sans SC', 'Poppins', 'Microsoft YaHei', 'sans-serif'`, letterSpacing: 1, fontWeight: 700 }}>
          通知详情
        </span>
        {/* 右侧菜单 */}
        <div className="absolute right-8 flex items-center gap-4 text-gray-700">
          <Link href="/" className="hover:text-blue-500 transition">主页</Link>
          <Link href="/UserGuide" className="hover:text-blue-500 transition">使用指引</Link>
          <Link href="/settings" className="hover:text-blue-500 transition">设置</Link>
          <div className="relative group">
            <Image src="/avatar-girl.png" alt="avatar" width={36} height={36} className="rounded-full border border-blue-200 bg-blue-100 cursor-pointer" />
            <div className="absolute right-0 mt-2 w-28 bg-white/90 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50">退出登录</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">{notification.title}</h1>
        
        {/* 统计概览区 */}
        <section className="flex flex-col md:flex-row gap-6 mb-8 px-2 z-10">
          <div className="flex-1 flex flex-row gap-6">
            <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl shadow border border-blue-100 p-6 flex flex-col items-center min-w-[140px]">
              <span className="text-gray-500 text-sm mb-1">总家长数</span>
              <span className="text-2xl font-bold text-blue-700">{notification.stats.total}</span>
            </div>
            <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl shadow border border-blue-100 p-6 flex flex-col items-center min-w-[140px]">
              <span className="text-gray-500 text-sm mb-1">已读人数</span>
              <span className="text-2xl font-bold text-green-600">{notification.stats.read}</span>
            </div>
            <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl shadow border border-blue-100 p-6 flex flex-col items-center min-w-[140px]">
              <span className="text-gray-500 text-sm mb-1">未读人数</span>
              <span className="text-2xl font-bold text-red-500">{notification.stats.unread}</span>
            </div>
            <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl shadow border border-blue-100 p-6 flex flex-col items-center min-w-[140px]">
              <span className="text-gray-500 text-sm mb-1">阅读率</span>
              <span className="text-2xl font-bold text-blue-900">{Math.round(notification.stats.read / notification.stats.total * 100)}%</span>
            </div>
          </div>
          {/* 圆环图 */}
          <div className="flex items-center justify-center min-w-[180px]">
            {/* @ts-ignore */}
            <PieChart width={120} height={120}>
              {/* @ts-ignore */}
              <Pie
                data={donutData}
                cx={60}
                cy={60}
                innerRadius={38}
                outerRadius={54}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {/* @ts-ignore */}
                {donutData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={donutColors[idx]} />
                ))}
              </Pie>
            </PieChart>
      </div>
        </section>

        {/* 家长阅读状态表格 */}
        <section className="max-w-7xl mx-auto w-full bg-white/60 backdrop-blur-xl rounded-2xl shadow border border-blue-100 p-0 overflow-hidden z-10 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4 px-6 pt-6">阅读名单</h2>
      {/* 操作区 */}
          <div className="flex flex-col md:flex-row gap-4 mb-4 px-6">
        <div className="flex gap-2">
          <button className={`px-3 py-1 rounded-lg text-sm font-medium border transition ${filter==='all'?'bg-blue-100 text-blue-700 border-blue-200':'bg-white text-gray-500 border-blue-100 hover:bg-blue-50'}`} onClick={()=>setFilter('all')}>全部</button>
          <button className={`px-3 py-1 rounded-lg text-sm font-medium border transition ${filter==='read'?'bg-blue-100 text-blue-700 border-blue-200':'bg-white text-gray-500 border-blue-100 hover:bg-blue-50'}`} onClick={()=>setFilter('read')}>已读</button>
          <button className={`px-3 py-1 rounded-lg text-sm font-medium border transition ${filter==='unread'?'bg-blue-100 text-blue-700 border-blue-200':'bg-white text-gray-500 border-blue-100 hover:bg-blue-50'}`} onClick={()=>setFilter('unread')}>未读</button>
        </div>
        <div className="flex-1 flex justify-end gap-2">
          <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium shadow border border-blue-100 transition" onClick={handleBatchRemind}><HiOutlineBell className="w-5 h-5 inline-block mr-1"/>批量提醒未读家长</button>
        </div>
      </div>
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="py-3 px-4 text-left text-blue-900">家长姓名</th>
              <th className="py-3 px-4 text-left text-blue-900">孩子姓名</th>
              <th className="py-3 px-4 text-center text-blue-900">是否已读</th>
              <th className="py-3 px-4 text-center text-blue-900">备注</th>
              <th className="py-3 px-4 text-center text-blue-900">操作</th>
            </tr>
          </thead>
          <tbody>
              {filteredParents.map(p => (
              <tr key={p.id} className="border-t border-blue-50 hover:bg-blue-50/40 transition">
                <td className="py-3 px-4 text-blue-900">{p.parentName}</td>
                <td className="py-3 px-4 text-blue-900">{p.childName}</td>
                <td className="py-3 px-4 text-center">
                  {p.read ? <HiOutlineCheckCircle className="w-5 h-5 text-green-500 inline"/> : <HiOutlineXCircle className="w-5 h-5 text-red-400 inline"/>}
                </td>
                <td className="py-3 px-4 text-center">
                  <input
                    className="border border-blue-100 rounded px-2 py-1 w-24 text-xs bg-white/80 text-blue-900 placeholder:text-gray-400"
                    value={p.remark}
                      onChange={e => handleRemark(p.id, e.target.value)}
                    placeholder="备注/标签"
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  {!p.read && <button className={`px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium hover:bg-blue-200 transition ${reminded.includes(p.id)?'opacity-60 cursor-not-allowed':''}`} disabled={reminded.includes(p.id)} onClick={()=>handleRemind(p.id)}><HiOutlineBell className="w-4 h-4 inline"/> 单独提醒</button>}
                  {reminded.includes(p.id) && <span className="ml-2 text-green-600 text-xs">已提醒</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      </main>
    </div>
  );
} 