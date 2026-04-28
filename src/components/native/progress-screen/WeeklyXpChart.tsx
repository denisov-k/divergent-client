import { View, Text } from "react-native";
import Svg from "react-native-svg";

import { appPalette } from "@/theme/palette";

const SvgPrimitives = Svg as typeof Svg & {
  Line: React.ComponentType<any>;
  Polyline: React.ComponentType<any>;
  Circle: React.ComponentType<any>;
};

export function WeeklyXpChart({ data }: { data: { name: string; value: number }[] }) {
  const width = 320;
  const height = 176;
  const paddingLeft = 16;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 36;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const gridLines = 4;
  const points = data.map((item, index) => ({
    ...item,
    x: paddingLeft + (data.length === 1 ? chartWidth / 2 : (index / (data.length - 1)) * chartWidth),
    y: paddingTop + chartHeight - (item.value / maxValue) * chartHeight,
  }));
  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <View style={{ gap: 8 }}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {Array.from({ length: gridLines + 1 }, (_, index) => {
          const y = paddingTop + (chartHeight / gridLines) * index;
          return <SvgPrimitives.Line key={`grid-${index}`} x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke={appPalette.semantic.borderSubtle} strokeWidth="1" />;
        })}
        <SvgPrimitives.Line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={paddingTop + chartHeight} stroke={appPalette.semantic.borderSubtle} strokeWidth="1" />
        <SvgPrimitives.Line x1={paddingLeft} y1={paddingTop + chartHeight} x2={width - paddingRight} y2={paddingTop + chartHeight} stroke={appPalette.semantic.borderStrong} strokeWidth="1" />
        <SvgPrimitives.Polyline points={polylinePoints} fill="none" stroke={appPalette.brand.primary} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((point) => (
          <SvgPrimitives.Circle key={`${point.name}-${point.x}`} cx={point.x} cy={point.y} r="4" fill={appPalette.brand.primary} />
        ))}
      </Svg>
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 4 }}>
        {data.map((item) => (
          <View key={item.name} style={{ flex: 1, alignItems: "center", gap: 2 }}>
            <Text style={{ color: appPalette.semantic.text, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{item.name}</Text>
            <Text style={{ color: appPalette.semantic.textMuted, fontSize: 10, fontWeight: "400", lineHeight: 14, fontFamily: "Montserrat" }}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
