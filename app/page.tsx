'use client';

import { useState } from 'react';
import {
  Baby, Utensils, Calendar, BookOpen, Heart,
  ChevronRight, Sparkles, Apple, Moon, Sun, Coffee
} from 'lucide-react';
import {
  recipes, babyDevelopment, weeklyMealPlan,
  getRecipeById, getRecipesByMealType,
  Recipe, WeeklyBabyDevelopment
} from '@/data/recipes';

type Tab = 'dashboard' | 'mealplan' | 'recipes';
type MealType = 'breakfast' | 'lunch' | 'dinner';

type RecipeCategory =
  | 'all'
  | 'breakfast'
  | 'dal'
  | 'vegetable'
  | 'rice'
  | 'bread'
  | 'salad'
  | 'soup'
  | 'drink'
  | 'sweet';

  type DayMealPlan = {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
};

type WeeklyPlan = DayMealPlan[];


export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedWeek, setSelectedWeek] = useState(14);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<RecipeCategory>('all');
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(() =>
  weeklyMealPlan.map(day => ({
    breakfast: [...day.breakfast],
    lunch: [...day.lunch],
    dinner: [...day.dinner],
  }))
);

const currentDayPlan = weeklyPlan[selectedDay];

const getMealRecipes = (mealType: MealType) => {
  return currentDayPlan[mealType]
    .map(id => getRecipeById(id))
    .filter(Boolean) as Recipe[];
};

const availableRecipes = recipes.filter(r =>
  r.mealType.includes(selectedMealType)
);

  const currentBabyInfo = babyDevelopment.find(b => b.week === selectedWeek) || babyDevelopment[0];
  // const currentDayPlan = weeklyMealPlan[selectedDay];

  const filteredRecipes =
    selectedCategory === 'all'
      ? recipes
      : recipes.filter(r => r.category === selectedCategory);


  // const getMealRecipes = (mealType: MealType) => {
  //   const recipeIds = currentDayPlan[mealType];
  //   return recipeIds.map(id => getRecipeById(id)).filter(Boolean) as Recipe[];
  // };

  const openRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  const closeRecipeModal = () => {
    setShowRecipeModal(false);
    setSelectedRecipe(null);
  };

  const toggleRecipeForMeal = (
  dayIndex: number,
  mealType: MealType,
  recipeId: string
) => {
  setWeeklyPlan(prev => {
    const updated = prev.map(day => ({
      breakfast: [...day.breakfast],
      lunch: [...day.lunch],
      dinner: [...day.dinner],
    }));

    const mealArray = updated[dayIndex][mealType];

    if (mealArray.includes(recipeId)) {
      updated[dayIndex][mealType] = mealArray.filter(
        id => id !== recipeId
      );
    } else {
      updated[dayIndex][mealType] = [...mealArray, recipeId];
    }

    return updated;
  });
};

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white py-6 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-full">
              <Baby className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">ગર્ભાવસ્થા આરોગ્ય યોજના</h1>
              <p className="text-green-100 text-sm">Pregnancy Health Plan - Diabetes & BP Management</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="badge bg-white/20 text-white">🤰 2nd Trimester</span>
            <span className="badge bg-white/20 text-white">🩺 GDM + BP</span>
            <span className="badge bg-white/20 text-white">🍽️ 105 Recipes</span>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', labelGuj: 'બાળક વિકાસ', icon: Baby },
              { id: 'mealplan', label: 'Meal Plan', labelGuj: 'ભોજન ચાર્ટ', icon: Calendar },
              { id: 'recipes', label: 'All Recipes', labelGuj: 'બધી રેસીપી', icon: BookOpen },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'tab-active' : 'tab-inactive'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.labelGuj}</span>
                <span className="sm:hidden">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Dashboard - Baby Development */}
        {activeTab === 'dashboard' && (
          <div className="animate-fadeIn space-y-6">
            {/* Week Selector */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-green-600" />
                અઠવાડિયું પસંદ કરો (Select Week)
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {babyDevelopment.map((week) => (
                  <button
                    key={week.week}
                    onClick={() => setSelectedWeek(week.week)}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl font-medium transition-all ${selectedWeek === week.week
                        ? 'bg-green-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                      }`}
                  >
                    <div className="text-2xl mb-1">{week.emoji}</div>
                    <div className="text-sm">Week {week.week}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Baby Development Card */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Baby Size Visualization */}
              <div className="card bg-gradient-to-br from-rose-50 to-pink-50">
                <div className="text-center">
                  <div className="baby-illustration w-32 h-32 mx-auto mb-4 shadow-lg">
                    <span>{currentBabyInfo.emoji}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Week {currentBabyInfo.week}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    બાળકનું કદ: <span className="font-bold text-rose-600">{currentBabyInfo.size}</span>
                  </p>
                  <p className="text-sm text-gray-500">({currentBabyInfo.sizeComparison})</p>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-sm text-gray-500">વજન (Weight)</p>
                      <p className="text-xl font-bold text-green-600">{currentBabyInfo.weight}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-sm text-gray-500">લંબાઈ (Length)</p>
                      <p className="text-xl font-bold text-green-600">{currentBabyInfo.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Development Details */}
              <div className="card">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  બાળકનો વિકાસ (Baby Development)
                </h3>
                <ul className="space-y-3">
                  {currentBabyInfo.developments.map((dev, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </span>
                      <span className="text-gray-700">{dev}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    માતામાં ફેરફાર (Mother's Changes)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentBabyInfo.motherChanges.map((change, i) => (
                      <span key={i} className="badge badge-rose">{change}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold text-gray-800 mb-3">💡 Tips</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentBabyInfo.tips.map((tip, i) => (
                      <span key={i} className="badge badge-green">{tip}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition Benefits */}
            <div className="card bg-gradient-to-r from-green-50 to-emerald-50">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🥗 આજના ભોજનથી બાળકને ફાયદા (Today's Meal Benefits)
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Coffee className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold">નાસ્તો</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• ફોલિક એસિડ → Neural development</li>
                    <li>• આયર્ન → Blood formation</li>
                    <li>• પ્રોટીન → Cell building</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-5 h-5 text-orange-500" />
                    <span className="font-semibold">બપોર</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• કેલ્શિયમ → Bone formation</li>
                    <li>• વિટામિન A → Eye development</li>
                    <li>• ફાઇબર → Digestion support</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="w-5 h-5 text-indigo-500" />
                    <span className="font-semibold">રાત્રે</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• પ્રોટીન → Tissue repair</li>
                    <li>• Zinc → Immune system</li>
                    <li>• B vitamins → Energy metabolism</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meal Plan Tab */}
        {activeTab === 'mealplan' && (
          <div className="animate-fadeIn space-y-6">
            {/* Day Selector */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                📅 દિવસ પસંદ કરો (Select Day)
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {weeklyMealPlan.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${selectedDay === index
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                      }`}
                  >
                    <div className="font-bold">{day.day}</div>
                    <div className="text-xs opacity-80">{day.dayEnglish}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Type Selector */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🍽️ ભોજન પ્રકાર (Meal Type)
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'breakfast' as MealType, label: 'નાસ્તો', labelEn: 'Breakfast', icon: Coffee, color: 'amber' },
                  { type: 'lunch' as MealType, label: 'બપોર', labelEn: 'Lunch', icon: Sun, color: 'orange' },
                  { type: 'dinner' as MealType, label: 'રાત્રે', labelEn: 'Dinner', icon: Moon, color: 'indigo' },
                ].map((meal) => (
                  <button
                    key={meal.type}
                    onClick={() => setSelectedMealType(meal.type)}
                    className={`p-4 rounded-xl transition-all ${selectedMealType === meal.type
                        ? `bg-${meal.color}-500 text-white shadow-lg scale-105`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    <meal.icon className={`w-8 h-8 mx-auto mb-2 ${selectedMealType === meal.type ? 'text-white' : `text-${meal.color}-500`
                      }`} />
                    <div className="font-bold">{meal.label}</div>
                    <div className="text-xs opacity-80">{meal.labelEn}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipe Options */}
            <div className="card">
              {availableRecipes.map(recipe => {
  const isSelected =
    currentDayPlan[selectedMealType].includes(recipe.id);

  return (
    <button
      key={recipe.id}
      onClick={() =>
        toggleRecipeForMeal(selectedDay, selectedMealType, recipe.id)
      }
      className={`p-4 rounded-xl border transition ${
        isSelected
          ? 'bg-green-500 text-white'
          : 'bg-gray-100 text-gray-700'
      }`}
    >
      <h3 className="font-bold">{recipe.name}</h3>
      <p className="text-sm">{recipe.english}</p>
    </button>
  );
})}
            </div>

            {/* Baby Benefits for Selected Meal */}
            <div className="card bg-gradient-to-r from-rose-50 to-pink-50">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                👶 {selectedMealType === 'breakfast' ? 'નાસ્તા' : selectedMealType === 'lunch' ? 'બપોરના ભોજન' : 'રાત્રિ ભોજન'}થી બાળકને ફાયદા
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {getMealRecipes(selectedMealType).slice(0, 2).map((recipe) => (
                  <div key={recipe.id} className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-gray-800 mb-2">{recipe.name}</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {recipe.babyBenefits.slice(0, 2).map((benefit, i) => (
                        <li key={i}>✓ {benefit}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* All Recipes Tab */}
        {activeTab === 'recipes' && (
          <div className="animate-fadeIn space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                📚 બધી રેસીપી (All 105 Recipes)
              </h2>
              <p className="text-gray-600 mb-4">Click on any recipe to see detailed preparation and cooking instructions</p>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { cat: 'all', label: '📦 All' },
                  { cat: 'breakfast', label: '🍳 નાસ્તો' },
                  { cat: 'dal', label: '🥣 દાળ' },
                  { cat: 'vegetable', label: '🥬 શાક' },
                  { cat: 'rice', label: '🍚 ભાત' },
                  { cat: 'bread', label: '🫓 રોટલી' },
                  { cat: 'salad', label: '🥗 સલાડ' },
                  { cat: 'soup', label: '🍲 સૂપ' },
                  { cat: 'drink', label: '🥛 પીણાં' },
                  { cat: 'sweet', label: '🍬 મીઠાઈ' },
                ].map(c => (
                  <button
                    key={c.cat}
                    onClick={() => setSelectedCategory(c.cat as RecipeCategory)}
                    className={`badge transition ${selectedCategory === c.cat
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Recipe Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => openRecipeModal(recipe)}
                    className="text-left p-4 bg-white rounded-xl border border-gray-100 hover:border-green-300 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800 group-hover:text-green-700">
                          {recipe.name}
                        </h3>
                        <p className="text-sm text-gray-500">{recipe.english}</p>
                      </div>
                      <span className={`badge ${recipe.nutrition.gi === 'ઓછો' ? 'badge-green' : 'badge-amber'
                        }`}>
                        GI: {recipe.nutrition.gi}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">⏱️ {recipe.time}m</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">🔥 {recipe.nutrition.calories}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">💪 {recipe.nutrition.protein}g</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Recipe Modal */}
      {showRecipeModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeRecipeModal}>
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
              <button
                onClick={closeRecipeModal}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold">{selectedRecipe.name}</h2>
              <p className="text-green-100">{selectedRecipe.english}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="badge bg-white/20 text-white">⏱️ {selectedRecipe.time} મિનિટ</span>
                <span className="badge bg-white/20 text-white">👥 {selectedRecipe.servings} સર્વિંગ</span>
                <span className="badge bg-white/20 text-white">📏 {selectedRecipe.portion}</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Nutrition */}
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <div className="text-2xl font-bold text-amber-600">{selectedRecipe.nutrition.calories}</div>
                  <div className="text-xs text-gray-600">Calories</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{selectedRecipe.nutrition.protein}g</div>
                  <div className="text-xs text-gray-600">Protein</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{selectedRecipe.nutrition.fiber}g</div>
                  <div className="text-xs text-gray-600">Fiber</div>
                </div>
                <div className="text-center p-3 bg-rose-50 rounded-xl">
                  <div className="text-2xl font-bold text-rose-600">{selectedRecipe.nutrition.gi}</div>
                  <div className="text-xs text-gray-600">GI Index</div>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  📦 સામગ્રી (Ingredients)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm">
                        <strong>{ing.item}</strong> - {ing.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pre-preparation */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  🔧 પૂર્વ-તૈયારી (Pre-Preparation)
                </h3>
                <div className="bg-amber-50 rounded-xl p-4">
                  <ol className="space-y-2">
                    {selectedRecipe.prePreparation.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Cooking Process */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  👩‍🍳 બનાવવાની રીત (Cooking Process)
                </h3>
                <div className="bg-green-50 rounded-xl p-4">
                  <ol className="space-y-3">
                    {selectedRecipe.cookingProcess.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Baby Benefits */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  👶 બાળકને ફાયદા (Baby Benefits)
                </h3>
                <div className="bg-rose-50 rounded-xl p-4">
                  <ul className="space-y-2">
                    {selectedRecipe.babyBenefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-rose-500">✓</span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Mother Benefits */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  🤰 માતાને ફાયદા (Mother Benefits)
                </h3>
                <div className="bg-purple-50 rounded-xl p-4">
                  <ul className="space-y-2">
                    {selectedRecipe.motherBenefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-purple-500">✓</span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tips */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  💡 ટિપ્સ (Tips)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.tips.map((tip, i) => (
                    <span key={i} className="badge bg-blue-100 text-blue-800">{tip}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            ⚠️ આ માર્ગદર્શિકા માત્ર સામાન્ય માહિતી માટે છે. ડૉક્ટરની સલાહ અવશ્ય લો.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Pregnancy Health Plan - Diabetes & BP Management | 105 Gujarati Recipes
          </p>
        </div>
      </footer>
    </div>
  );
}
