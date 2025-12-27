-- mindmaps テーブルの作成
CREATE TABLE IF NOT EXISTS mindmaps (
  id TEXT PRIMARY KEY,
  encrypted_data TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- デフォルトレコードの挿入
INSERT INTO mindmaps (id, encrypted_data)
VALUES ('default', '')
ON CONFLICT (id) DO NOTHING;

-- 更新日時の自動更新用トリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガーの作成
DROP TRIGGER IF EXISTS update_mindmaps_updated_at ON mindmaps;
CREATE TRIGGER update_mindmaps_updated_at
  BEFORE UPDATE ON mindmaps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
