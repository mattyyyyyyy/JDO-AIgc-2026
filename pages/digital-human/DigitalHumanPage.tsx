import React, { useState } from 'react';
import Landing from './Landing';
import Studio from '../../components/Studio';
import { AppModule, Asset } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { DH_TEXT_CONTENT } from './constants';

const DigitalHumanPage: React.FC = () => {
  const { lang, setLang, t: t_root } = useLanguage();
  const [currentDHModule, setCurrentDHModule] = useState<AppModule | null>(null);
  const [savedAssets, setSavedAssets] = useState<Asset[]>([]);

  const handleSelectModule = (module: AppModule) => {
    setCurrentDHModule(module);
  };

  const handleSaveAsset = (asset: Asset) => {
    setSavedAssets(prev => [asset, ...prev]);
  };

  const t_dh = (DH_TEXT_CONTENT as any)[lang] || DH_TEXT_CONTENT.CN;

  if (currentDHModule) {
    return (
      <Studio 
        module={currentDHModule} 
        onChangeModule={setCurrentDHModule}
        onBack={() => setCurrentDHModule(null)}
        lang={lang}
        setLang={setLang}
        onOpenSettings={() => {}}
        savedAssets={savedAssets}
        onSaveAsset={handleSaveAsset}
        t={t_dh}
      />
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Landing onSelectModule={handleSelectModule} />
    </div>
  );
};

export default DigitalHumanPage;