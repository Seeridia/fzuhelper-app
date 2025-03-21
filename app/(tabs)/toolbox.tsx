import { Link, useRouter, type Href, type Router } from 'expo-router';
import { forwardRef, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import BannerImage1 from '@/assets/images/banner/default_banner1.webp';
import BannerImage2 from '@/assets/images/banner/default_banner2.webp';
import BannerImage3 from '@/assets/images/banner/default_banner3.webp';
import ApplicationIcon from '@/assets/images/toolbox/ic_application.svg';
import ExamRoomIcon from '@/assets/images/toolbox/ic_examroom.svg';
import FileIcon from '@/assets/images/toolbox/ic_file.svg';
import GradeIcon from '@/assets/images/toolbox/ic_grade.svg';
import GraduationIcon from '@/assets/images/toolbox/ic_graduation.svg';
import JiaXiIcon from '@/assets/images/toolbox/ic_jiaxi.svg';
import OneKeyIcon from '@/assets/images/toolbox/ic_onekey.svg';
import RoomIcon from '@/assets/images/toolbox/ic_room.svg';
import FZURunIcon from '@/assets/images/toolbox/ic_run.svg';
import IDCardIcon from '@/assets/images/toolbox/ic_studentcard.svg';
import StudyCenter from '@/assets/images/toolbox/ic_studycenter.svg';
import WikiIcon from '@/assets/images/toolbox/ic_wiki.svg';
import XuankeIcon from '@/assets/images/toolbox/ic_xuanke.svg';
import ZHCTIcon from '@/assets/images/toolbox/ic_zhct.svg';
import Banner, { type BannerContent } from '@/components/banner';
import PageContainer from '@/components/page-container';
import { Button, ButtonProps } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { LocalUser, USER_TYPE_UNDERGRADUATE } from '@/lib/user';
import { cn } from '@/lib/utils';
import { getWebViewHref } from '@/lib/webview';
import { ToolType, UserType, toolOnPress, type Tool } from '@/utils/tools';

// 工具类型的枚举

// 常量：横幅数据
const DEFAULT_BANNERS: BannerContent[] = [
  { image: BannerImage1, onPress: () => {} },
  { image: BannerImage2, onPress: () => {} },
  { image: BannerImage3, onPress: () => {} },
];

const DEFAULT_TOOLS: Tool[] = [
  {
    name: '学业状况',
    icon: GradeIcon,
    type: ToolType.LINK,
    href: '/toolbox/academic',
  },
  {
    name: '历年卷',
    icon: FileIcon,
    type: ToolType.LINK,
    href: '/toolbox/paper',
  },
  {
    name: '空教室',
    icon: RoomIcon,
    type: ToolType.LINK,
    href: '/toolbox/empty-room',
  },
  {
    name: '考场查询',
    icon: ExamRoomIcon,
    type: ToolType.LINK,
    href: '/toolbox/exam-room',
  },
  {
    name: '一键评议',
    icon: OneKeyIcon,
    type: ToolType.FUNCTION,
    userTypes: [USER_TYPE_UNDERGRADUATE],
    action: async () => {
      Alert.alert('暂未开放', '新版一键评议正在设计中，预计学期结束前（即评议开始前）上线，敬请期待');
    },
  },
  {
    name: '选课',
    icon: XuankeIcon,
    type: ToolType.LINK,
    href: '/toolbox/xuanke',
    userTypes: [USER_TYPE_UNDERGRADUATE],
  },
  {
    name: '各类申请',
    icon: ApplicationIcon,
    type: ToolType.LINK,
    href: '/toolbox/application',
    userTypes: [USER_TYPE_UNDERGRADUATE],
  },
  {
    name: '学生证',
    icon: IDCardIcon,
    type: ToolType.LINK,
    href: '/toolbox/id-card',
    userTypes: [USER_TYPE_UNDERGRADUATE],
  },
  {
    name: '毕业设计',
    icon: GraduationIcon,
    type: ToolType.LINK,
    href: '/toolbox/graduation',
    userTypes: [USER_TYPE_UNDERGRADUATE],
  },
  {
    name: '嘉锡讲坛',
    icon: JiaXiIcon,
    type: ToolType.WEBVIEW,
    params: {
      url: 'https://jwcjwxt2.fzu.edu.cn:81/student/glbm/lecture/jxjt_cszt.aspx',
      title: '嘉锡讲坛',
      jwch: true,
    },
    userTypes: [USER_TYPE_UNDERGRADUATE],
  },
  {
    name: '智慧餐厅',
    icon: ZHCTIcon,
    type: ToolType.WEBVIEW,
    params: {
      url: 'http://hqczhct.fzu.edu.cn:8001/html/index.html',
      title: '智慧餐厅',
    },
  },
  {
    name: '校园指南',
    icon: WikiIcon,
    type: ToolType.WEBVIEW,
    params: {
      url: 'https://fzuwiki.west2.online/?source=fzuhelper&utm_source=fzuhelper-app&utm_medium=toolbox',
      title: '校园指南',
    },
  },
  {
    name: '飞跃手册',
    icon: FZURunIcon,
    type: ToolType.WEBVIEW,
    params: {
      url: 'https://run.west2.online/?source=fzuhelper&utm_source=fzuhelper-app&utm_medium=toolbox',
      title: '飞跃手册',
    },
  },
  {
    name: '学习中心',
    icon: StudyCenter,
    type: ToolType.LINK,
    href: '/toolbox/learning-center',
  },
];

// 工具函数：处理工具数据，按 5 的倍数填充占位符
const processTools = (tools: Tool[]) => {
  const remainder = tools.length % 5;
  if (remainder === 0) return tools; // 不需要填充

  const placeholders = Array(5 - remainder).fill({
    name: '',
    icon: null,
    type: ToolType.NULL,
    data: '',
  });

  return [...tools, ...placeholders];
};

// 自定义 Hook：管理横幅和工具数据
const useToolsPageData = () => {
  const [bannerList, setBannerList] = useState<BannerContent[]>([]);
  const [toolList, setToolList] = useState<Tool[]>([]);

  useEffect(() => {
    // 模拟数据加载
    setBannerList(DEFAULT_BANNERS);
    setToolList(
      // 此处会进行一层过滤，只显示当前用户类型可用的工具
      processTools(
        DEFAULT_TOOLS.filter(item => !item.userTypes || item.userTypes.includes(LocalUser.getUser().type as UserType)),
      ),
    );
  }, []);

  return { bannerList, toolList };
};

type ToolButtonProps = Omit<ButtonProps, 'size'> & {
  name: string;
  icon?: React.FC<SvgProps>;
};

// eslint-disable-next-line react/display-name
const ToolButton = forwardRef<React.ElementRef<typeof Pressable>, ToolButtonProps>(
  ({ className, icon: Icon, name, onPress }, ref) => (
    <Button
      className={cn('mb-3 h-auto w-auto items-center justify-center bg-transparent', className)}
      size="icon"
      onPress={onPress}
      ref={ref}
    >
      {Icon ? <Icon width="42px" height="42px" /> : null}
      <Text
        className="w-[50px] text-center align-middle text-text-secondary"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ fontSize: 12 }} // 未知原因，tailwind指定text-xs无效
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {name}
      </Text>
    </Button>
  ),
);

type ToolButtonLinkProps = Omit<ToolButtonProps, 'onPress'> & {
  href: Href;
};

const ToolButtonLink: React.FC<ToolButtonLinkProps> = ({ href, ...props }) => (
  <Link href={href} asChild>
    <ToolButton {...props} />
  </Link>
);

// 工具按钮的渲染函数
const renderToolButton = (item: Tool, router: Router) => {
  if (item.type === ToolType.LINK) {
    return <ToolButtonLink name={item.name} href={item.href} icon={item.icon} />;
  }

  if (item.type === ToolType.WEBVIEW) {
    return <ToolButtonLink name={item.name} href={getWebViewHref(item.params)} icon={item.icon} />;
  }

  return <ToolButton name={item.name} icon={item.icon} onPress={() => toolOnPress(item, router)} />;
};

export default function ToolsPage() {
  const { bannerList, toolList } = useToolsPageData();
  const router = useRouter();

  return (
    <PageContainer className="p-6">
      {/* 滚动横幅 */}
      <Banner contents={bannerList} />

      {/* 工具区域 */}
      <FlatList
        data={toolList}
        keyExtractor={(_, index) => index.toString()}
        numColumns={5}
        className="mt-4"
        columnWrapperClassName="justify-between"
        renderItem={({ item }) => renderToolButton(item, router)}
      />
    </PageContainer>
  );
}
