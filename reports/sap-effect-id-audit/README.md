# Đối chiếu Weather Effects và Mutation (V2.3.1)

Nguồn đã đọc: `C:/Users/truongthinh.bui_ctv/Downloads/[Craftland] Steal A Pet Master Data.xlsx`, bản local sửa ngày 05/11/2026. Không xác nhận đây là bản SAP online mới nhất. File nguồn không bị sửa.

## Kết quả

- Mutation (V2.3.1): 11 dòng ID số 1–11, bao gồm Normal ID 1.
- Weather Effects: 11 dòng ID số 1–11. Ghi chú sheet xác định đây là WeatherID = WeatherEffectID, không phải WeatherType.
- Đối chiếu 17 alias trong config: 11 đang dùng, 6 retired. Các ID nguồn đã có khớp tên; sửa tham chiếu sheet Mutation 2.0 sang Mutation (V2.3.1).
- Bổ sung effectType, effectId, effectRef, mutationId/weatherEffectId. Alias id cũ vẫn được giữ cho weights, icon và inventory cũ. Dùng cặp type + ID khi tích hợp SAP: Mutation:2 khác WeatherEffect:2.
- Giữ nguyên MaterialKey/EffectKey và giá trị nguồn. Weather không có hai cột này; Icon được đưa vào iconKey riêng. Không dùng Icon làm tên effect khi nguồn chưa xác nhận.
- Football ID 10 có EffectKey RadioactiveEffect trong nguồn. Không tự sửa thành footballEffect.
- Đưa đủ 22 dòng nguồn vào GenConfig.effectTables để đối chiếu, không tự bật thêm Gen hoặc Normal vào fishing pool.
- Web pool và CSV đã lọc có thêm SAP ID, SAP Type và key nguồn.

## Phạm vi giữ nguyên

Pool cá, 11 Gen đang bật, weight theo cả 5 band, rarity, tỉ lệ tap, hệ số giá mua và thuật toán bốc giữ nguyên. Các JSON/Excel output phiên bản cũ vẫn là snapshot lịch sử, chưa tái xuất workbook. Cập nhật runtime và CSV đối chiếu mới.

## Kiểm tra

`node tools/check-sap-effect-ids.cjs`: kiểm tra ID/tên/key trùng khớp; 22 ID nguồn duy nhất trong từng bảng; 17 alias; config xác suất không đổi. Chạy mô phỏng cùng seed, 200 người × 7 ngày trước/sau cho kết quả giống nhau, bỏ qua chữ ký metadata.

Chữ ký snapshot được cập nhật theo config có thêm metadata sau khi kiểm tra mô phỏng không đổi; không đổi số liệu snapshot. `node tools/check-web-entrypoints.cjs` pass.

## File giao

- `gen-id-mapping.csv`: 17 alias → SAP type/ID/key, có cờ active.
- `sap-effect-tables.csv`: toàn bộ 22 dòng source, mở được trong Excel.
- `sap-source-effects.json`: bản trích nguồn, mapping và SHA-256 workbook.
- `validation.json`: kết quả kiểm tra và chữ ký trước/sau.
