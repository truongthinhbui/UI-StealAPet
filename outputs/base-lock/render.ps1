Add-Type -AssemblyName System.Drawing
$root = $PSScriptRoot
$sprites = 'D:/SAP_GDD/SAP_GDD/dist/assets/ui-sprites/storage'
$img = [System.Drawing.Bitmap]::new("$root/gameplay-source.png")
$g = [System.Drawing.Graphics]::FromImage($img)
$g.SmoothingMode = 'AntiAlias'
$g.TextRenderingHint = 'AntiAliasGridFit'
function Sprite($name,$x,$y,$w,$h) {
 $s=[System.Drawing.Image]::FromFile("$sprites/$name.png")
 $g.DrawImage($s,[System.Drawing.Rectangle]::new($x,$y,$w,$h)); $s.Dispose()
}
function Slice($name,$x,$y,$w,$h,$l,$t,$r,$b) {
 $s=[System.Drawing.Image]::FromFile("$sprites/$name.png")
 $xs=@(0,$l,($s.Width-$r),$s.Width); $ys=@(0,$t,($s.Height-$b),$s.Height)
 $dx=@($x,($x+$l),($x+$w-$r),($x+$w)); $dy=@($y,($y+$t),($y+$h-$b),($y+$h))
 for($i=0;$i -lt 3;$i++){for($j=0;$j -lt 3;$j++){
 $dst=[System.Drawing.Rectangle]::new($dx[$i],$dy[$j],($dx[$i+1]-$dx[$i]),($dy[$j+1]-$dy[$j]))
 $g.DrawImage($s,$dst,$xs[$i],$ys[$j],($xs[$i+1]-$xs[$i]),($ys[$j+1]-$ys[$j]),[System.Drawing.GraphicsUnit]::Pixel)
 }}; $s.Dispose()
}
function Label($text,$x,$y,$w,$h,$size,$color,$bold=$false) {
 $style=[System.Drawing.FontStyle]::Regular; if($bold){$style=[System.Drawing.FontStyle]::Bold}
 $f=[System.Drawing.Font]::new('Arial',$size,$style,[System.Drawing.GraphicsUnit]::Pixel)
 $brush=[System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($color))
 $fmt=[System.Drawing.StringFormat]::new(); $fmt.Alignment='Center'; $fmt.LineAlignment='Center'
 $g.DrawString($text,$f,$brush,[System.Drawing.RectangleF]::new($x,$y,$w,$h),$fmt)
 $f.Dispose();$brush.Dispose();$fmt.Dispose()
}
$dim=[System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(115,0,8,20));$g.FillRectangle($dim,0,0,$img.Width,$img.Height);$dim.Dispose()
Slice 'NewAssets__ContainerBG' 502 202 770 610 34 32 33 39
Sprite 'NewAssets__TitleBG' 502 193 770 115
Label 'KHÓA BASE' 610 219 550 58 37 '#ffffff' $true
Sprite 'NewAssets__CloseButton' 1215 210 54 54
Slice 'NewAssets__ItemBG' 560 337 160 160 20 20 20 20
Sprite 'Icons__LockIcon' 597 355 86 106
Label 'x3' 650 458 52 30 25 '#245481' $true
Label 'Khóa bảo vệ base' 751 334 449 47 32 '#245481' $true
Label 'Thời gian bảo vệ: 3 phút' 745 389 461 42 27 '#245481'
Label 'Đang có: 3 item' 745 437 461 35 25 '#245481'
Label 'Dùng 1 item để ngăn người khác vào lấy pet.' 545 524 684 42 26 '#245481'
Label 'Chỉ kích hoạt khi base đã hết thời gian khóa.' 545 572 684 38 23 '#526c88'
Slice 'NewAssets__BlueButton' 565 662 278 73 50 20 20 25
Slice 'NewAssets__YellowButton' 877 662 333 73 50 20 20 25
Label 'ĐỂ SAU' 580 668 253 55 28 '#ffffff' $true
Label 'DÙNG 1 ITEM' 895 668 304 55 28 '#634313' $true
Label 'Sau khi dùng còn 2 item' 768 749 454 29 21 '#526c88'
$g.Dispose()
$img.Save("$root/base-lock-mockup.png",[System.Drawing.Imaging.ImageFormat]::Png);$img.Dispose()
