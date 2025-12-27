-- mindmaps テーブルに name カラムを追加
ALTER TABLE mindmaps 
ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '新しいマインドマップ';

-- 既存の 'default' レコードの名前を更新
UPDATE mindmaps 
SET name = 'メイン・マインドマップ' 
WHERE id = 'default';
