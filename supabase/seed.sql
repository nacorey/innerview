-- 시드 데이터: 4종 진단 도구 삽입
-- 이 파일은 data/seed/*.json에서 자동 생성됨

INSERT INTO diagnostic_tools (
  slug, name, name_en, description, icon,
  questions, scale_type, scale_options, category_map,
  reverse_items, max_scale, interpretations, chart_config, pattern_config,
  is_active, sort_order
) VALUES (
  'ta-egogram',
  'TA 에고그램',
  'TA Egogram',
  '교류분석(Transactional Analysis)에 기반한 자아상태 진단. 5가지 자아상태(CP, NP, A, FC, AC)의 에너지 분포를 파악합니다.',
  '🎭',
  '[{"id":0,"text":"나는 사실과 데이터를 근거로 판단하려고 한다."},{"id":1,"text":"재미있는 일이 있으면 즉시 하고 싶어진다."},{"id":2,"text":"나는 호기심이 많고 새로운 것을 좋아한다."},{"id":3,"text":"다른 사람의 기분을 살피며 행동하는 편이다."},{"id":4,"text":"규칙을 어기는 사람을 보면 지적하고 싶다."},{"id":5,"text":"어려운 처지에 있는 사람을 보면 도와주고 싶다."},{"id":6,"text":"다른 사람의 이야기를 끝까지 경청하는 편이다."},{"id":7,"text":"결정을 내리기 전에 장단점을 꼼꼼히 따져본다."},{"id":8,"text":"나는 감정 표현이 솔직하고 자유로운 편이다."},{"id":9,"text":"시간 약속을 철저하게 지키는 편이다."},{"id":10,"text":"상대방의 부탁을 거절하기 어렵다."},{"id":11,"text":"윗사람의 지시에는 되도록 따르는 편이다."},{"id":12,"text":"주변 사람들을 격려하고 칭찬하는 것을 좋아한다."},{"id":13,"text":"잘못된 일에 대해서는 엄하게 지적하는 편이다."},{"id":14,"text":"나는 감정보다 이성적으로 생각하려고 노력한다."},{"id":15,"text":"즐거운 일이 있으면 크게 웃고 표현한다."},{"id":16,"text":"타인의 실수를 너그럽게 이해하려고 한다."},{"id":17,"text":"나보다 남의 의견을 먼저 따르는 경향이 있다."},{"id":18,"text":"문제가 발생하면 원인을 체계적으로 분석한다."},{"id":19,"text":"사회적 규범과 도덕을 중요하게 여긴다."},{"id":20,"text":"객관적인 정보를 바탕으로 상황을 판단한다."},{"id":21,"text":"하고 싶은 말을 참지 않고 바로 하는 편이다."},{"id":22,"text":"책임감이 강하고 맡은 일은 반드시 해낸다."},{"id":23,"text":"다른 사람이 힘들어할 때 함께 슬퍼하는 편이다."},{"id":24,"text":"갈등 상황에서 자신의 의견을 잘 내세우지 못한다."},{"id":25,"text":"타인의 평가가 신경 쓰여 행동이 조심스럽다."},{"id":26,"text":"옳고 그름에 대한 기준이 명확하다."},{"id":27,"text":"놀이나 여가 활동을 매우 즐기는 편이다."},{"id":28,"text":"게으른 사람을 보면 답답하게 느껴진다."},{"id":29,"text":"혼자 결정하기보다 다른 사람에게 의존하는 편이다."},{"id":30,"text":"실수하면 자신을 심하게 자책하는 편이다."},{"id":31,"text":"분위기를 밝게 만드는 역할을 자주 한다."},{"id":32,"text":"나는 계획을 세우고 그에 따라 행동하는 편이다."},{"id":33,"text":"새로운 아이디어를 생각해내는 것을 좋아한다."},{"id":34,"text":"다른 사람의 시선이 의식되어 자유롭지 못할 때가 있다."},{"id":35,"text":"상황을 냉정하게 관찰하고 판단하려 한다."},{"id":36,"text":"기분이 좋으면 노래를 흥얼거리거나 춤을 춘다."},{"id":37,"text":"약속이나 규율을 어기는 것이 불쾌하다."},{"id":38,"text":"다른 사람에게 ''~해야 한다''는 말을 자주 한다."},{"id":39,"text":"복잡한 문제를 논리적으로 정리하는 것을 잘한다."},{"id":40,"text":"감정에 휘둘리지 않고 합리적으로 대처하려 한다."},{"id":41,"text":"다른 사람의 장점을 잘 발견하고 인정해준다."},{"id":42,"text":"누군가 아프거나 다치면 즉시 돌봐주려 한다."},{"id":43,"text":"무질서한 환경을 보면 정리하고 싶어진다."},{"id":44,"text":"직감이나 느낌을 중요하게 여기는 편이다."},{"id":45,"text":"주변 사람들에게 따뜻한 말을 자주 건넨다."},{"id":46,"text":"남에게 폐를 끼칠까 봐 걱정이 많은 편이다."},{"id":47,"text":"봉사활동이나 남을 돕는 일에 보람을 느낀다."},{"id":48,"text":"정보를 수집하고 비교 분석한 뒤 결론을 내린다."},{"id":49,"text":"상대방의 입장에서 생각하려고 노력한다."}]'::jsonb,
  'likert-4',
  '[{"value":0,"label":"전혀 아니다","emoji":"😶"},{"value":1,"label":"약간 그렇다","emoji":"🤔"},{"value":2,"label":"꽤 그렇다","emoji":"😊"},{"value":3,"label":"매우 그렇다","emoji":"💯"}]'::jsonb,
  '{"CP":[4,9,13,19,22,26,28,37,38,43],"NP":[5,6,12,16,23,41,42,45,47,49],"A":[0,7,14,18,20,32,35,39,40,48],"FC":[1,2,8,15,21,27,31,33,36,44],"AC":[3,10,11,17,24,25,29,30,34,46]}'::jsonb,
  '[]'::jsonb,
  NULL,
  '{"CP":{"name":"CP","fullName":"비판적 어버이","nameEn":"Critical Parent","color":"#E53E3E","icon":"⚖️","description":"규칙, 도덕, 책임감, 질서를 중시하는 자아상태입니다. 옳고 그름에 대한 판단이 명확하며 타인에게도 높은 기준을 요구합니다.","highDescription":"책임감이 강하고 원칙을 중시합니다. 리더십이 있으나, 지나치면 비판적이고 권위적으로 보일 수 있습니다. 타인의 실수에 엄격하고 ''~해야 한다''는 표현을 자주 사용합니다.","lowDescription":"규범에 대한 의식이 낮고 유연한 편입니다. 타인에게 관대하지만, 책임감이나 도덕적 기준이 부족해 보일 수 있습니다.","highLabel":"높은 CP","lowLabel":"낮은 CP","threshold":15},"NP":{"name":"NP","fullName":"양육적 어버이","nameEn":"Nurturing Parent","color":"#38A169","icon":"🤗","description":"돌봄, 배려, 공감, 격려를 중시하는 자아상태입니다. 타인의 감정에 민감하게 반응하며 도움을 주려는 성향이 강합니다.","highDescription":"따뜻하고 배려심이 깊습니다. 타인을 잘 돌보고 격려하지만, 지나치면 과보호나 간섭으로 이어질 수 있습니다. 자신보다 남을 우선시하는 경향이 있습니다.","lowDescription":"타인에 대한 관심과 배려가 적은 편입니다. 독립적이지만, 냉담하거나 무관심하게 비칠 수 있습니다.","highLabel":"높은 NP","lowLabel":"낮은 NP","threshold":15},"A":{"name":"A","fullName":"성인","nameEn":"Adult","color":"#3182CE","icon":"🧠","description":"논리적, 객관적, 합리적 사고를 중시하는 자아상태입니다. 사실과 데이터를 기반으로 판단하며 감정에 휘둘리지 않으려 합니다.","highDescription":"이성적이고 분석적입니다. 문제 해결 능력이 뛰어나지만, 지나치면 감정이 메마르고 기계적으로 보일 수 있습니다. 계획적이고 체계적인 접근을 선호합니다.","lowDescription":"논리적 분석보다 직관이나 감정에 따라 행동하는 편입니다. 즉흥적이며, 계획성이 부족해 보일 수 있습니다.","highLabel":"높은 A","lowLabel":"낮은 A","threshold":15},"FC":{"name":"FC","fullName":"자유로운 어린이","nameEn":"Free Child","color":"#D69E2E","icon":"🎨","description":"자유분방함, 창의성, 솔직한 감정 표현을 특징으로 하는 자아상태입니다. 호기심이 많고 즐거움을 추구합니다.","highDescription":"밝고 활기차며 창의적입니다. 감정 표현이 솔직하고 주변을 즐겁게 만듭니다. 그러나 지나치면 충동적이고 자기중심적으로 보일 수 있습니다.","lowDescription":"감정 표현이 억제되어 있고 조심스러운 편입니다. 진지하고 차분하지만, 활력이 부족하고 재미없어 보일 수 있습니다.","highLabel":"높은 FC","lowLabel":"낮은 FC","threshold":15},"AC":{"name":"AC","fullName":"순응하는 어린이","nameEn":"Adapted Child","color":"#805AD5","icon":"🙈","description":"타인의 기대에 맞추려 하고, 눈치를 보며 순응하는 자아상태입니다. 갈등을 회피하고 자기주장을 억제하는 경향이 있습니다.","highDescription":"협조적이고 예의 바릅니다. 타인과의 조화를 중시하지만, 지나치면 자기 의견을 표현하지 못하고 스트레스를 내면화합니다. 거절을 어려워하며 타인 의존적일 수 있습니다.","lowDescription":"타인의 시선을 크게 의식하지 않고 자기 뜻대로 행동합니다. 주체적이지만, 사회적 상황에서 부적절하게 보일 수 있습니다.","highLabel":"높은 AC","lowLabel":"낮은 AC","threshold":15}}'::jsonb,
  '{"primary":"line","secondary":["radar","bar"],"maxScore":30}'::jsonb,
  '{"type":"egogram","patterns":[{"label":"역N형","description":"NP와 FC가 높고 CP와 AC가 낮은 유형으로, 자유롭고 따뜻한 성향입니다.","detailDescription":"양육적 어버이(NP)와 자유로운 어린이(FC)의 에너지가 높아, 타인에게 따뜻하면서도 자신의 감정을 자유롭게 표현하는 유형입니다. 창의적이고 공감 능력이 뛰어나지만, 규율이나 논리적 판단이 약할 수 있습니다. 대인관계에서 호감을 주며, 예술이나 상담 분야에 적합합니다."},{"label":"N형","description":"CP와 AC가 높고 NP와 FC가 낮은 유형으로, 규율과 순응이 강한 성향입니다.","detailDescription":"비판적 어버이(CP)와 순응하는 어린이(AC)의 에너지가 높아, 규칙을 중시하면서도 타인의 평가에 민감한 유형입니다. 내면에 갈등이 많을 수 있으며, 자신에게도 타인에게도 엄격한 기준을 적용합니다. 스트레스 관리와 자기 수용이 중요한 과제입니다."},{"label":"V형","description":"CP와 FC가 높고 A가 낮은 유형으로, 감정의 기복이 큰 성향입니다.","detailDescription":"비판적 어버이(CP)와 자유로운 어린이(FC)가 높고 성인(A) 자아가 낮아, 감정적 반응이 강한 유형입니다. 열정적이고 카리스마가 있지만, 논리적 판단이 약하여 감정에 따라 행동할 수 있습니다. 이성과 감정의 균형을 찾는 것이 성장 과제입니다."},{"label":"W형","description":"NP와 AC가 낮고 CP, A, FC가 높은 유형으로, 주도적이고 분석적인 성향입니다.","detailDescription":"비판적 어버이(CP), 성인(A), 자유로운 어린이(FC)가 고르게 높고 양육(NP)과 순응(AC)이 낮은 유형입니다. 자기 확신이 강하고 독립적이며 분석력과 창의성을 겸비합니다. 그러나 타인에 대한 배려나 협조성이 부족해 보일 수 있어, 관계에서의 유연성을 키울 필요가 있습니다."},{"label":"M형","description":"NP와 AC가 높고 CP, A, FC가 낮은 유형으로, 배려심 깊고 순응적인 성향입니다.","detailDescription":"양육적 어버이(NP)와 순응하는 어린이(AC)가 높아 타인을 잘 돌보면서도 자신의 욕구는 억제하는 유형입니다. 조화를 중시하고 주변 사람들에게 헌신적이지만, 자기주장이 약하고 스트레스를 내면화하는 경향이 있습니다. 자기 돌봄과 건강한 경계 설정이 필요합니다."},{"label":"평탄형","description":"5가지 자아상태의 에너지가 고르게 분포된 유형으로, 균형 잡힌 성향입니다.","detailDescription":"모든 자아상태가 비슷한 수준으로, 상황에 따라 유연하게 대처할 수 있는 유형입니다. 특별히 튀는 성향 없이 안정적이지만, 뚜렷한 개성이나 강점이 드러나지 않을 수 있습니다. 자신이 더 발전시키고 싶은 자아상태를 의식적으로 키워나가면 좋습니다."},{"label":"우상향형","description":"CP에서 AC로 갈수록 점수가 높아지는 유형으로, 순응적이고 감성적인 성향입니다.","detailDescription":"왼쪽(CP)에서 오른쪽(AC)으로 갈수록 에너지가 높아지는 패턴입니다. 규율이나 비판보다 감정과 관계를 중시하며, 자유로운 표현과 타인에 대한 순응이 강합니다. 자기주장과 원칙을 세우는 연습이 필요하며, 주도적인 역할 경험이 성장에 도움이 됩니다."},{"label":"우하향형","description":"CP에서 AC로 갈수록 점수가 낮아지는 유형으로, 주도적이고 원칙적인 성향입니다.","detailDescription":"왼쪽(CP)에서 오른쪽(AC)으로 갈수록 에너지가 낮아지는 패턴입니다. 원칙과 규율을 중시하며 리더십이 강하지만, 타인의 감정이나 분위기에 둔감할 수 있습니다. 공감 능력을 키우고 타인의 입장을 이해하려는 노력이 성장 과제입니다."}]}'::jsonb,
  true,
  1
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  questions = EXCLUDED.questions,
  scale_type = EXCLUDED.scale_type,
  scale_options = EXCLUDED.scale_options,
  category_map = EXCLUDED.category_map,
  reverse_items = EXCLUDED.reverse_items,
  max_scale = EXCLUDED.max_scale,
  interpretations = EXCLUDED.interpretations,
  chart_config = EXCLUDED.chart_config,
  pattern_config = EXCLUDED.pattern_config,
  updated_at = NOW();

INSERT INTO diagnostic_tools (
  slug, name, name_en, description, icon,
  questions, scale_type, scale_options, category_map,
  reverse_items, max_scale, interpretations, chart_config, pattern_config,
  is_active, sort_order
) VALUES (
  'bfi2',
  'BFI-2 성격 5요인',
  'BFI-2 Big Five',
  '성격심리학의 Big Five 모델에 기반한 성격 진단. 외향성, 우호성, 성실성, 부정적 정서성, 개방성의 5가지 성격 차원을 측정합니다.',
  '🧠',
  '[{"id":0,"text":"나는 사교적이고 외향적이다."},{"id":1,"text":"나는 다른 사람에게 동정심을 느낀다."},{"id":2,"text":"나는 체계적이지 않은 편이다."},{"id":3,"text":"나는 걱정이 많다."},{"id":4,"text":"나는 예술에 관심이 없다."},{"id":5,"text":"나는 리더 역할을 맡는 편이다."},{"id":6,"text":"나는 다른 사람을 존중한다."},{"id":7,"text":"나는 일을 시작하기 어렵다."},{"id":8,"text":"나는 우울한 기분을 자주 느낀다."},{"id":9,"text":"나는 다양한 주제에 흥미가 있다."},{"id":10,"text":"나는 조용한 편이다."},{"id":11,"text":"나는 다른 사람의 감정에 관심이 적다."},{"id":12,"text":"나는 계획을 세우고 실행한다."},{"id":13,"text":"나는 쉽게 긴장한다."},{"id":14,"text":"나는 깊이 있는 사고를 좋아한다."},{"id":15,"text":"나는 활력이 넘친다."},{"id":16,"text":"나는 다른 사람과 갈등을 일으키는 편이다."},{"id":17,"text":"나는 꾸준하게 노력한다."},{"id":18,"text":"나는 감정 기복이 심하다."},{"id":19,"text":"나는 상상력이 풍부하다."},{"id":20,"text":"나는 열정적으로 대화한다."},{"id":21,"text":"나는 무례하게 행동하는 편이다."},{"id":22,"text":"나는 게으른 편이다."},{"id":23,"text":"나는 감정적으로 안정되어 있다."},{"id":24,"text":"나는 창의적이지 않은 편이다."},{"id":25,"text":"나는 수줍음을 타는 편이다."},{"id":26,"text":"나는 관대하고 너그럽다."},{"id":27,"text":"나는 책임감이 부족한 편이다."},{"id":28,"text":"나는 침착하고 차분하다."},{"id":29,"text":"나는 예술적 경험에 관심이 적다."},{"id":30,"text":"나는 자기 주장을 잘 못 한다."},{"id":31,"text":"나는 용서를 잘하는 편이다."},{"id":32,"text":"나는 정리정돈을 잘한다."},{"id":33,"text":"나는 불안감을 자주 느낀다."},{"id":34,"text":"나는 새로운 아이디어에 열려 있다."},{"id":35,"text":"나는 말수가 적은 편이다."},{"id":36,"text":"나는 냉정하고 무관심한 편이다."},{"id":37,"text":"나는 맡은 일을 끝까지 해낸다."},{"id":38,"text":"나는 쉽게 슬퍼진다."},{"id":39,"text":"나는 지적 호기심이 강하다."},{"id":40,"text":"나는 에너지가 넘친다."},{"id":41,"text":"나는 다른 사람을 의심하는 편이다."},{"id":42,"text":"나는 신뢰할 수 있는 사람이다."},{"id":43,"text":"나는 감정을 잘 다스린다."},{"id":44,"text":"나는 변화보다 익숙한 것을 선호한다."},{"id":45,"text":"나는 사람들과 어울리는 것을 좋아한다."},{"id":46,"text":"나는 가끔 타인에게 불친절하다."},{"id":47,"text":"나는 집중력이 부족한 편이다."},{"id":48,"text":"나는 스트레스를 잘 받지 않는다."},{"id":49,"text":"나는 복잡한 문제에 흥미가 없다."},{"id":50,"text":"나는 내성적인 편이다."},{"id":51,"text":"나는 따뜻하고 친절한 사람이다."},{"id":52,"text":"나는 부지런한 편이다."},{"id":53,"text":"나는 쉽게 화가 난다."},{"id":54,"text":"나는 전통적인 방식을 따르는 편이다."},{"id":55,"text":"나는 자신감이 있다."},{"id":56,"text":"나는 겸손한 편이다."},{"id":57,"text":"나는 일을 체계적으로 하지 못한다."},{"id":58,"text":"나는 자주 외로움을 느낀다."},{"id":59,"text":"나는 철학적 토론을 즐긴다."}]'::jsonb,
  'likert-5',
  '[{"value":1,"label":"전혀 그렇지 않다","emoji":"❌"},{"value":2,"label":"그렇지 않다","emoji":"🤷"},{"value":3,"label":"보통이다","emoji":"😐"},{"value":4,"label":"그렇다","emoji":"👍"},{"value":5,"label":"매우 그렇다","emoji":"💯"}]'::jsonb,
  '{"Extraversion":[0,5,10,15,20,25,30,35,40,45,50,55],"Agreeableness":[1,6,11,16,21,26,31,36,41,46,51,56],"Conscientiousness":[2,7,12,17,22,27,32,37,42,47,52,57],"NegativeEmotionality":[3,8,13,18,23,28,33,38,43,48,53,58],"OpenMindedness":[4,9,14,19,24,29,34,39,44,49,54,59]}'::jsonb,
  '[2,4,7,10,15,16,21,22,23,24,25,27,28,29,30,35,36,41,43,44,46,47,48,49,50,54,57]'::jsonb,
  5,
  '{"Extraversion":{"name":"외향성","fullName":"외향성 (Extraversion)","nameEn":"Extraversion","color":"#FF6B6B","icon":"🎉","description":"사회적 상호작용에서 에너지를 얻는 정도, 자기 주장성, 활력 수준을 측정합니다.","threshold":36,"highLabel":"높은 외향성","lowLabel":"낮은 외향성","highDescription":"사교적이고 활발하며, 사람들과 어울리는 것에서 에너지를 얻습니다. 리더 역할을 맡는 것을 즐기고, 대화를 주도하며, 새로운 사람을 만나는 것을 좋아합니다. 자신감이 넘치고 열정적인 모습을 보입니다.","lowDescription":"조용하고 내성적이며, 혼자만의 시간에서 에너지를 충전합니다. 소규모 모임이나 일대일 대화를 선호하고, 깊이 있는 관계를 중시합니다. 신중하고 사려 깊은 성향을 보입니다."},"Agreeableness":{"name":"우호성","fullName":"우호성 (Agreeableness)","nameEn":"Agreeableness","color":"#4ECDC4","icon":"🤝","description":"타인에 대한 공감, 배려, 협조적 태도, 신뢰감의 정도를 측정합니다.","threshold":36,"highLabel":"높은 우호성","lowLabel":"낮은 우호성","highDescription":"따뜻하고 친절하며, 타인의 감정에 깊이 공감합니다. 협력적이고 관대하며, 갈등을 피하고 조화를 추구합니다. 남을 돕는 것에서 보람을 느끼고, 용서를 잘합니다.","lowDescription":"독립적이고 분석적이며, 감정보다 논리를 중시합니다. 자신의 의견을 직설적으로 표현하고, 타인의 동기를 비판적으로 평가합니다. 경쟁적 환경에서 강점을 보입니다."},"Conscientiousness":{"name":"성실성","fullName":"성실성 (Conscientiousness)","nameEn":"Conscientiousness","color":"#45B7D1","icon":"📋","description":"목표 지향적 행동, 자기 통제, 책임감, 조직력의 정도를 측정합니다.","threshold":36,"highLabel":"높은 성실성","lowLabel":"낮은 성실성","highDescription":"체계적이고 부지런하며, 계획을 세우고 꾸준히 실행합니다. 책임감이 강하고 신뢰할 수 있으며, 정리정돈을 잘합니다. 목표를 향해 끈기 있게 노력하는 모습을 보입니다.","lowDescription":"유연하고 자유분방하며, 즉흥적인 행동을 선호합니다. 엄격한 계획보다 상황에 따른 적응을 중시하고, 다양한 가능성을 탐색합니다. 창의적이고 개방적인 접근을 보입니다."},"NegativeEmotionality":{"name":"부정적 정서성","fullName":"부정적 정서성 (Negative Emotionality)","nameEn":"Negative Emotionality","color":"#96CEB4","icon":"🌊","description":"불안, 우울, 감정 기복 등 부정적 감정을 경험하는 빈도와 강도를 측정합니다.","threshold":36,"highLabel":"높은 부정적 정서성","lowLabel":"낮은 부정적 정서성","highDescription":"감정의 기복이 크고, 스트레스에 민감하게 반응합니다. 걱정이 많고 불안감을 자주 느끼며, 부정적인 감정을 강하게 경험합니다. 감정적으로 풍부하지만 때로 압도당하는 느낌을 받을 수 있습니다.","lowDescription":"감정적으로 안정되어 있고, 스트레스 상황에서도 침착함을 유지합니다. 걱정이 적고 회복력이 강하며, 어려운 상황에서도 평정심을 잃지 않습니다. 감정을 효과적으로 조절하는 능력을 보입니다."},"OpenMindedness":{"name":"개방성","fullName":"개방성 (Open-Mindedness)","nameEn":"Open-Mindedness","color":"#FFEAA7","icon":"🎨","description":"지적 호기심, 창의성, 예술적 감수성, 새로운 경험에 대한 수용성을 측정합니다.","threshold":36,"highLabel":"높은 개방성","lowLabel":"낮은 개방성","highDescription":"상상력이 풍부하고 창의적이며, 새로운 아이디어와 경험을 적극적으로 탐색합니다. 지적 호기심이 강하고, 예술과 문화에 깊은 관심을 가집니다. 복잡한 문제를 깊이 사고하는 것을 즐깁니다.","lowDescription":"현실적이고 실용적이며, 검증된 방법과 전통적인 접근을 선호합니다. 구체적이고 명확한 것을 중시하고, 안정적인 환경에서 강점을 보입니다. 실질적인 결과를 추구합니다."}}'::jsonb,
  '{"primary":"radar","secondary":["bar"],"maxScore":60}'::jsonb,
  '{}'::jsonb,
  true,
  2
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  questions = EXCLUDED.questions,
  scale_type = EXCLUDED.scale_type,
  scale_options = EXCLUDED.scale_options,
  category_map = EXCLUDED.category_map,
  reverse_items = EXCLUDED.reverse_items,
  max_scale = EXCLUDED.max_scale,
  interpretations = EXCLUDED.interpretations,
  chart_config = EXCLUDED.chart_config,
  pattern_config = EXCLUDED.pattern_config,
  updated_at = NOW();

INSERT INTO diagnostic_tools (
  slug, name, name_en, description, icon,
  questions, scale_type, scale_options, category_map,
  reverse_items, max_scale, interpretations, chart_config, pattern_config,
  is_active, sort_order
) VALUES (
  'nlp-vak',
  'NLP VAK 선호표상체계',
  'NLP VAK Representational System',
  'NLP(신경언어프로그래밍)에 기반한 감각 선호 체계 진단. 시각(V), 청각(A), 체감각(K), 내적대화(D) 중 주된 정보처리 방식을 파악합니다.',
  '👁️',
  '[{"id":0,"text":"새로운 것을 배울 때 나는...","options":[{"text":"도표, 그림, 영상 등 시각 자료를 보며 배운다","channel":"V"},{"text":"강의를 듣거나 설명을 들으며 배운다","channel":"A"},{"text":"직접 해보고 몸으로 체험하며 배운다","channel":"K"},{"text":"논리적으로 분석하고 스스로 정리하며 배운다","channel":"D"}]},{"id":1,"text":"중요한 결정을 내릴 때 나는...","options":[{"text":"결과를 머릿속으로 그려보고 시각화한다","channel":"V"},{"text":"신뢰하는 사람과 이야기를 나눠본다","channel":"A"},{"text":"직감이나 느낌을 따른다","channel":"K"},{"text":"장단점을 논리적으로 따져본다","channel":"D"}]},{"id":2,"text":"기분이 좋지 않을 때 나는...","options":[{"text":"좋았던 장면이나 풍경을 떠올린다","channel":"V"},{"text":"좋아하는 음악을 듣거나 누군가와 대화한다","channel":"A"},{"text":"산책하거나 운동 등 몸을 움직인다","channel":"K"},{"text":"혼자 생각을 정리하고 원인을 분석한다","channel":"D"}]},{"id":3,"text":"누군가를 처음 만났을 때 가장 먼저 기억에 남는 것은...","options":[{"text":"상대방의 외모, 옷차림, 표정","channel":"V"},{"text":"상대방의 목소리 톤이나 말투","channel":"A"},{"text":"악수했을 때의 느낌이나 분위기","channel":"K"},{"text":"상대방이 한 말의 내용과 논리","channel":"D"}]},{"id":4,"text":"여행지를 고를 때 나는...","options":[{"text":"사진이나 영상을 보고 경치가 아름다운 곳을 선택한다","channel":"V"},{"text":"다른 사람의 후기나 추천을 듣고 결정한다","channel":"A"},{"text":"액티비티가 많고 체험할 수 있는 곳을 선호한다","channel":"K"},{"text":"비용, 일정, 동선을 꼼꼼히 비교하고 계획한다","channel":"D"}]},{"id":5,"text":"스트레스를 해소할 때 나는...","options":[{"text":"영화를 보거나 예쁜 풍경 사진을 감상한다","channel":"V"},{"text":"좋아하는 음악을 듣거나 친구와 수다를 떤다","channel":"A"},{"text":"운동을 하거나 마사지를 받는다","channel":"K"},{"text":"일기를 쓰거나 머릿속으로 상황을 정리한다","channel":"D"}]},{"id":6,"text":"회의나 수업에서 집중이 잘 되는 경우는...","options":[{"text":"슬라이드, 도표 등 시각 자료가 풍부할 때","channel":"V"},{"text":"발표자의 설명이 명확하고 목소리가 좋을 때","channel":"A"},{"text":"실습이나 참여 활동이 포함되어 있을 때","channel":"K"},{"text":"내용이 논리적이고 체계적으로 구성되어 있을 때","channel":"D"}]},{"id":7,"text":"과거의 추억을 떠올릴 때 나는...","options":[{"text":"그때의 장면이나 풍경이 눈앞에 떠오른다","channel":"V"},{"text":"그때 들었던 소리나 대화가 귀에 맴돈다","channel":"A"},{"text":"그때의 감정이나 신체 감각이 다시 느껴진다","channel":"K"},{"text":"그때 무슨 일이 있었는지 사실 관계를 되짚는다","channel":"D"}]},{"id":8,"text":"물건을 살 때 나는...","options":[{"text":"디자인, 색상 등 외관을 가장 중요하게 본다","channel":"V"},{"text":"주변 사람의 추천이나 리뷰 영상을 참고한다","channel":"A"},{"text":"직접 만져보고 사용감을 확인한다","channel":"K"},{"text":"스펙, 가성비, 성능을 비교 분석한다","channel":"D"}]},{"id":9,"text":"다른 사람에게 무언가를 설명할 때 나는...","options":[{"text":"그림을 그리거나 자료를 보여주며 설명한다","channel":"V"},{"text":"말로 자세히 이야기하거나 비유를 사용한다","channel":"A"},{"text":"직접 시범을 보여주거나 함께 해본다","channel":"K"},{"text":"순서와 논리에 따라 단계별로 정리해서 전달한다","channel":"D"}]}]'::jsonb,
  'rank-4',
  '[{"value":4,"label":"가장 해당","emoji":"🥇"},{"value":3,"label":"두 번째","emoji":"🥈"},{"value":2,"label":"세 번째","emoji":"🥉"},{"value":1,"label":"가장 적게 해당","emoji":"4️⃣"}]'::jsonb,
  '{"V":[0,1,2,3,4,5,6,7,8,9],"A":[0,1,2,3,4,5,6,7,8,9],"K":[0,1,2,3,4,5,6,7,8,9],"D":[0,1,2,3,4,5,6,7,8,9]}'::jsonb,
  '[]'::jsonb,
  NULL,
  '{"V":{"label":"시각형 (Visual)","color":"#4F46E5","icon":"👁️","description":"시각적 정보를 통해 세상을 이해하고 처리하는 유형입니다. 이미지, 색상, 도표, 공간 배치 등을 통해 정보를 가장 효과적으로 받아들입니다.","highDescription":"당신은 강한 시각적 선호를 보입니다. 머릿속으로 이미지를 쉽게 떠올리고, 시각 자료를 통해 빠르게 학습합니다. 외모, 디자인, 색감 등에 민감하며, 정보를 정리할 때 도표나 마인드맵을 활용하면 효과적입니다.","lowDescription":"시각적 채널의 활용도가 상대적으로 낮습니다. 시각화 연습이나 이미지 트레이닝을 통해 이 채널을 강화하면 정보 처리의 폭이 넓어질 수 있습니다.","highLabel":"시각 우위","lowLabel":"시각 비우위","threshold":25},"A":{"label":"청각형 (Auditory)","color":"#059669","icon":"👂","description":"소리와 언어를 통해 세상을 이해하고 처리하는 유형입니다. 대화, 음악, 톤, 리듬 등 청각적 요소에 민감하게 반응합니다.","highDescription":"당신은 강한 청각적 선호를 보입니다. 듣는 것만으로도 잘 기억하고, 대화를 통해 생각을 정리합니다. 강의나 팟캐스트 등 음성 기반 학습이 효과적이며, 조용한 환경에서 집중력이 높아집니다.","lowDescription":"청각적 채널의 활용도가 상대적으로 낮습니다. 소리 내어 읽기, 녹음 후 다시 듣기 등의 방법으로 이 채널을 개발하면 학습과 소통에 도움이 됩니다.","highLabel":"청각 우위","lowLabel":"청각 비우위","threshold":25},"K":{"label":"체감각형 (Kinesthetic)","color":"#DC2626","icon":"✋","description":"신체 감각과 감정을 통해 세상을 이해하고 처리하는 유형입니다. 직접 체험하고 느끼는 것을 통해 가장 깊이 있는 학습이 이루어집니다.","highDescription":"당신은 강한 체감각적 선호를 보입니다. 직접 해보면서 배우고, 감정과 직감을 중요시합니다. 실습, 역할극, 현장 체험 등 몸을 움직이는 활동에서 가장 효과적으로 학습하며, 편안한 물리적 환경이 집중에 중요합니다.","lowDescription":"체감각적 채널의 활용도가 상대적으로 낮습니다. 신체 활동을 늘리고, 감정에 주의를 기울이는 연습을 하면 자기 인식과 학습 효과를 높일 수 있습니다.","highLabel":"체감각 우위","lowLabel":"체감각 비우위","threshold":25},"D":{"label":"내적대화형 (Auditory Digital)","color":"#7C3AED","icon":"💭","description":"논리, 분석, 내적 대화를 통해 세상을 이해하고 처리하는 유형입니다. 사실, 데이터, 체계적 사고를 중시하며 스스로와의 대화를 통해 정보를 정리합니다.","highDescription":"당신은 강한 내적대화적 선호를 보입니다. 논리적 분석과 체계적 정리에 뛰어나며, 사실과 데이터에 기반한 판단을 선호합니다. 글쓰기, 목록 작성, 비교 분석 등을 통해 효과적으로 학습하며, 명확한 구조와 절차를 중요시합니다.","lowDescription":"내적대화적 채널의 활용도가 상대적으로 낮습니다. 자기 대화 연습, 일기 쓰기, 논리적 정리 훈련을 통해 이 채널을 강화하면 의사결정과 문제 해결 능력이 향상됩니다.","highLabel":"내적대화 우위","lowLabel":"내적대화 비우위","threshold":25}}'::jsonb,
  '{"primary":"donut","secondary":["bar"],"maxScore":40}'::jsonb,
  '{}'::jsonb,
  true,
  3
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  questions = EXCLUDED.questions,
  scale_type = EXCLUDED.scale_type,
  scale_options = EXCLUDED.scale_options,
  category_map = EXCLUDED.category_map,
  reverse_items = EXCLUDED.reverse_items,
  max_scale = EXCLUDED.max_scale,
  interpretations = EXCLUDED.interpretations,
  chart_config = EXCLUDED.chart_config,
  pattern_config = EXCLUDED.pattern_config,
  updated_at = NOW();

INSERT INTO diagnostic_tools (
  slug, name, name_en, description, icon,
  questions, scale_type, scale_options, category_map,
  reverse_items, max_scale, interpretations, chart_config, pattern_config,
  is_active, sort_order
) VALUES (
  'conflict-style',
  '갈등유형 진단',
  'Conflict Style Assessment',
  'Thomas-Kilmann 갈등해결 모델에 기반한 갈등 대처 유형 진단. 경쟁, 회피, 타협, 순응, 협력의 5가지 갈등 대처 방식을 측정합니다.',
  '⚖️',
  '[{"id":0,"text":"갈등 상황에서 내 의견이 관철될 때까지 강하게 주장하는 편이다."},{"id":1,"text":"의견 충돌이 생기면 가능한 한 그 상황을 피하려고 한다."},{"id":2,"text":"갈등이 있을 때 서로 조금씩 양보하여 중간 지점을 찾으려 한다."},{"id":3,"text":"상대방의 기분이 상하지 않도록 내 의견을 접는 경우가 많다."},{"id":4,"text":"갈등 상황에서 양쪽 모두 만족할 수 있는 해결책을 찾으려 노력한다."},{"id":5,"text":"논쟁에서 이기는 것이 나에게 중요하다."},{"id":6,"text":"불편한 대화가 예상되면 그 주제를 꺼내지 않는 편이다."},{"id":7,"text":"완벽한 해결보다는 적당한 합의를 선호한다."},{"id":8,"text":"관계를 유지하기 위해 상대방의 요구를 먼저 수용하는 편이다."},{"id":9,"text":"문제가 생기면 상대방과 함께 머리를 맞대고 최선의 방안을 모색한다."},{"id":10,"text":"내가 옳다고 확신하면 상대방의 반대에도 밀어붙이는 편이다."},{"id":11,"text":"갈등이 심해지면 자리를 피하거나 화제를 돌리는 편이다."},{"id":12,"text":"서로 반반씩 나누는 것이 가장 공정한 해결 방법이라고 생각한다."},{"id":13,"text":"상대방이 강하게 주장하면 나는 한 발 물러서는 편이다."},{"id":14,"text":"갈등 해결을 위해 상대방의 입장을 깊이 이해하려고 노력한다."},{"id":15,"text":"팀에서 의견이 다를 때 내 방식대로 결정하려는 경향이 있다."},{"id":16,"text":"사소한 갈등은 무시하고 시간이 해결해 주길 기대한다."},{"id":17,"text":"협상에서 서로 조금씩 포기하는 것이 현실적이라고 생각한다."},{"id":18,"text":"상대방의 감정을 배려하여 내 욕구를 뒤로 미루는 경우가 있다."},{"id":19,"text":"의견 차이가 있을 때 대화를 통해 새로운 대안을 창출하려 한다."},{"id":20,"text":"경쟁적인 상황에서 반드시 승리해야 한다는 생각이 강하다."},{"id":21,"text":"갈등이 예상되는 모임이나 회의를 가능하면 피하고 싶다."},{"id":22,"text":"양쪽의 핵심 요구를 절충하는 방식으로 합의점을 도출하려 한다."},{"id":23,"text":"다른 사람의 필요를 나의 필요보다 우선시하는 경향이 있다."},{"id":24,"text":"갈등 상황에서 모든 당사자의 관심사를 통합하는 해결책을 추구한다."},{"id":25,"text":"내 권리나 이익을 지키기 위해 강경한 태도를 취할 수 있다."},{"id":26,"text":"갈등 상황이 불편하여 아무 말도 하지 않고 넘어가는 경우가 많다."},{"id":27,"text":"완벽한 결과보다 빠른 합의를 이끌어내는 것이 효율적이라 생각한다."},{"id":28,"text":"조화를 위해 내 생각과 다르더라도 상대방의 의견에 동의하곤 한다."},{"id":29,"text":"복잡한 갈등일수록 충분한 대화와 협의를 통해 윈-윈 결과를 만들려 한다."}]'::jsonb,
  'likert-5',
  '[{"value":1,"label":"전혀 그렇지 않다","emoji":"❌"},{"value":2,"label":"그렇지 않다","emoji":"🤷"},{"value":3,"label":"보통이다","emoji":"😐"},{"value":4,"label":"그렇다","emoji":"👍"},{"value":5,"label":"매우 그렇다","emoji":"💯"}]'::jsonb,
  '{"경쟁":[0,5,10,15,20,25],"회피":[1,6,11,16,21,26],"타협":[2,7,12,17,22,27],"순응":[3,8,13,18,23,28],"협력":[4,9,14,19,24,29]}'::jsonb,
  '[]'::jsonb,
  NULL,
  '{"경쟁":{"nameEn":"Competing","color":"#EF4444","icon":"⚔️","description":"자신의 입장과 이익을 강하게 주장하며, 상대방보다 우위에 서려는 갈등 대처 방식입니다. 결단력과 추진력이 강점이지만, 관계 손상의 위험이 있습니다.","highDescription":"갈등 상황에서 자신의 의견을 강하게 관철시키려는 경향이 높습니다. 리더십과 결단력이 뛰어나지만, 타인의 감정이나 의견을 간과할 수 있으므로 경청하는 자세가 필요합니다.","lowDescription":"자신의 입장을 적극적으로 주장하는 데 소극적입니다. 갈등을 피하지 않고 필요할 때 자신의 의견을 분명히 표현하는 연습이 도움이 될 수 있습니다.","highLabel":"강한 경쟁형","lowLabel":"약한 경쟁형","threshold":18},"회피":{"nameEn":"Avoiding","color":"#6B7280","icon":"🏃","description":"갈등 상황 자체를 피하거나 무시하는 대처 방식입니다. 불필요한 충돌을 줄일 수 있지만, 문제가 해결되지 않고 축적될 수 있습니다.","highDescription":"갈등을 회피하려는 경향이 강합니다. 단기적으로는 평화를 유지할 수 있지만, 장기적으로 미해결 문제가 쌓일 수 있습니다. 작은 갈등부터 직면하는 연습이 도움이 됩니다.","lowDescription":"갈등 상황을 회피하지 않고 적극적으로 대면하는 편입니다. 다만, 모든 갈등에 개입하기보다 전략적으로 선택하는 것이 에너지 관리에 효과적입니다.","highLabel":"강한 회피형","lowLabel":"약한 회피형","threshold":18},"타협":{"nameEn":"Compromising","color":"#F59E0B","icon":"🤝","description":"양측이 적당히 양보하여 중간 지점에서 합의를 이끌어내는 방식입니다. 현실적이고 효율적이지만, 양쪽 모두 완전히 만족하지 못할 수 있습니다.","highDescription":"서로 양보를 통해 합의점을 찾는 데 능숙합니다. 실용적인 해결 능력이 뛰어나지만, 때로는 더 나은 해결책을 위해 깊이 탐색하는 것도 고려해 보세요.","lowDescription":"중간 지점에서의 타협보다는 다른 방식의 갈등 해결을 선호합니다. 시간이 제한된 상황에서는 타협이 효과적인 전략이 될 수 있음을 기억하세요.","highLabel":"강한 타협형","lowLabel":"약한 타협형","threshold":18},"순응":{"nameEn":"Accommodating","color":"#3B82F6","icon":"🕊️","description":"상대방의 요구와 감정을 우선시하며 자신의 입장을 양보하는 방식입니다. 관계 유지에 효과적이지만, 자신의 필요가 지속적으로 무시될 수 있습니다.","highDescription":"타인의 필요를 자신보다 우선시하는 경향이 높습니다. 배려심이 깊지만, 자신의 욕구와 권리도 중요하게 다루는 균형이 필요합니다.","lowDescription":"자신의 입장을 쉽게 양보하지 않는 편입니다. 때로는 관계의 조화를 위해 상대방의 요구를 수용하는 유연성도 필요할 수 있습니다.","highLabel":"강한 순응형","lowLabel":"약한 순응형","threshold":18},"협력":{"nameEn":"Collaborating","color":"#10B981","icon":"🤗","description":"양측의 관심사를 모두 충족시키는 윈-윈 해결책을 함께 모색하는 방식입니다. 가장 이상적이지만, 시간과 에너지가 많이 소요될 수 있습니다.","highDescription":"모든 당사자가 만족하는 해결책을 찾으려는 노력이 뛰어납니다. 창의적 문제 해결 능력이 강점이며, 시간 효율성을 고려한 판단도 함께 기르면 좋습니다.","lowDescription":"공동의 해결책을 모색하기보다 다른 방식으로 갈등을 처리하는 경향이 있습니다. 중요한 갈등에서는 협력적 접근이 장기적으로 더 좋은 결과를 가져올 수 있습니다.","highLabel":"강한 협력형","lowLabel":"약한 협력형","threshold":18}}'::jsonb,
  '{"primary":"bar","secondary":["radar","matrix"],"maxScore":30,"axisLabels":{"xLabel":"타인 관심도","yLabel":"자기 주장도","positions":{"경쟁":{"x":0.2,"y":0.9},"회피":{"x":0.2,"y":0.2},"타협":{"x":0.5,"y":0.5},"순응":{"x":0.9,"y":0.2},"협력":{"x":0.9,"y":0.9}}}}'::jsonb,
  '{}'::jsonb,
  true,
  4
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  questions = EXCLUDED.questions,
  scale_type = EXCLUDED.scale_type,
  scale_options = EXCLUDED.scale_options,
  category_map = EXCLUDED.category_map,
  reverse_items = EXCLUDED.reverse_items,
  max_scale = EXCLUDED.max_scale,
  interpretations = EXCLUDED.interpretations,
  chart_config = EXCLUDED.chart_config,
  pattern_config = EXCLUDED.pattern_config,
  updated_at = NOW();

