import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

export function SEO({
  title = "단축키모아 - Windows, macOS, Linux 단축키 모음 앱",
  description = "단축키모아로 Windows, macOS, Linux 숨겨진 단축키를 한눈에 확인하세요. 생산성 향상을 위한 필수 키보드 숏컷 모음집.",
  keywords = "단축키 앱, 생산성 도구, 키보드 숏컷, Windows 단축키, macOS 단축키, Linux 단축키, 개발자 도구",
  ogImage = "/og-image.png",
  canonical = "https://shortcuthub.netlify.app"
}: SEOProps) {
  useEffect(() => {
    // 동적으로 title 업데이트
    document.title = title;
    
    // 메타 태그 업데이트 함수
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };
    
    // 캐논니컬 링크 업데이트
    const updateCanonical = (href: string) => {
      let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      
      element.setAttribute('href', href);
    };
    
    // 메타 태그들 업데이트
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    
    // 캐논니컬 업데이트
    updateCanonical(canonical);
    
  }, [title, description, keywords, ogImage, canonical]);

  return null;
}

// 페이지별 SEO 설정을 위한 훅
export function useSEO(seoProps: SEOProps) {
  return <SEO {...seoProps} />;
}
