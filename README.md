import React, { useState } from 'react';
import { Camera, Scan, Trophy, CheckCircle, XCircle } from 'lucide-react';

export default function KnowItAllDebugApp() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [prompt, setPrompt] = useState(null);
  const [userCards, setUserCards] = useState([]);
  const [scannedAnswers, setScannedAnswers] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [revealIndex, setRevealIndex] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const countries = {
    '001': 'United States',
    '002': 'China', 
    '003': 'Japan',
    '004': 'Germany',
    '005': 'India'
  };

  const testPrompt = {
    label: 'Rank by GDP (Highest to Lowest)',
    correctOrder: ['001', '002', '003', '004', '005']
  };

  // Test the complete flow step by step
  const runCompleteTest = () => {
    console.log('🧪 Starting complete test...');
    
    // Step 1: Set prompt and cards
    setPrompt(testPrompt);
    setUserCards(['001', '002', '003', '004', '005']);
    console.log('✅ Step 1: Prompt and cards set');
    
    // Step 2: Set bid to 4 for testing
    setBidAmount('4');
    console.log('✅ Step 2: Bid amount set to 4');
    
    // Step 3: Simulate scanning 4 answers (matching the bid)
    const testAnswers = ['001', '002', '003', '004'];
    setScannedAnswers(testAnswers);
    setRevealIndex(0);
    console.log('✅ Step 3: Scanned answers set:', testAnswers);
    
    // Step 4: Go to reveal screen
    setCurrentScreen(4);
    console.log('✅ Step 4: Moving to reveal screen (4)');
  };

  const scanPromptCard = () => {
    setIsScanning(true);
    setTimeout(() => {
      setPrompt(testPrompt);
      setUserCards(['001', '002', '003', '004', '005']);
      setIsScanning(false);
      setCurrentScreen(2);
      console.log('Prompt scan complete, moving to screen 2');
    }, 1000);
  };

  const validateAndContinue = () => {
    console.log('validateAndContinue called');
    console.log('bidAmount value:', bidAmount);
    console.log('bidAmount type:', typeof bidAmount);
    console.log('bidAmount as number:', parseInt(bidAmount));
    
    if (!bidAmount || bidAmount === '' || parseInt(bidAmount) < 1) {
      console.log('Validation failed - invalid bid amount');
      alert('Please enter a valid bid amount (1 or higher)');
      return;
    }
    
    console.log('Validation passed, moving to screen 3');
    setCurrentScreen(3);
  };

  const scanAnswerCards = () => {
    setIsScanning(true);
    console.log('Starting answer card scan...');
    console.log('Bid amount:', bidAmount);
    
    setTimeout(() => {
      // Generate the correct number of test answers based on bid amount
      const numCards = parseInt(bidAmount);
      const testAnswers = ['001', '002', '003', '004', '005'].slice(0, numCards);
      setScannedAnswers(testAnswers);
      setRevealIndex(0);
      setIsScanning(false);
      console.log(`Answer scan complete. Generated ${numCards} answers:`, testAnswers);
      console.log('Moving to reveal screen (4)');
      setCurrentScreen(4);
    }, 2000);
  };

  const revealNext = () => {
    console.log('Reveal next called. Current revealIndex:', revealIndex);
    console.log('Scanned answers:', scannedAnswers);
    
    if (revealIndex < scannedAnswers.length) {
      const userCard = scannedAnswers[revealIndex];
      console.log('Revealing card:', userCard);
      
      // Check if this card is blocked
      const blockedCard = blocks.find(block => block.cardId === userCard);
      if (blockedCard) {
        console.log('Hit a block!');
        setGameResult({
          success: false,
          message: `Hit a block at position ${revealIndex + 1}!`,
          bidderScore: 0,
          blockerScore: 10
        });
        setCurrentScreen(5);
        return;
      }
      
      // Check ordering (for position 2+)
      if (revealIndex > 0) {
        const previousCard = scannedAnswers[revealIndex - 1];
        const currentCardIndex = prompt.correctOrder.indexOf(userCard);
        const previousCardIndex = prompt.correctOrder.indexOf(previousCard);
        
        if (currentCardIndex < previousCardIndex) {
          console.log('Wrong order detected!');
          setGameResult({
            success: false,
            message: `Wrong order at position ${revealIndex + 1}!`,
            bidderScore: 0,
            blockerScore: 10
          });
          setCurrentScreen(5);
          return;
        }
      }
      
      // Continue revealing
      const nextIndex = revealIndex + 1;
      setRevealIndex(nextIndex);
      console.log('Moving to next reveal index:', nextIndex);
      
      if (nextIndex >= scannedAnswers.length) {
        console.log('All cards revealed successfully! Staying on reveal screen.');
        setGameResult({
          success: true,
          message: 'Perfect! All cards correct!',
          bidderScore: parseInt(bidAmount),
          blockerScore: 0
        });
        // Don't auto-advance to results - let user click button
      }
    }
  };

  const newGame = () => {
    setCurrentScreen(1);
    setPrompt(null);
    setUserCards([]);
    setScannedAnswers([]);
    setBlocks([]);
    setBidAmount('');
    setRevealIndex(0);
    setGameResult(null);
    setIsScanning(false);
  };

  // Debug Screen
  if (currentScreen === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h1 className="text-2xl font-bold text-center mb-6">🧪 Debug Mode</h1>
            
            <div className="space-y-4">
              <button
                onClick={runCompleteTest}
                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
              >
                🧪 Run Complete Test (Skip to Reveal)
              </button>
              
              <button
                onClick={scanPromptCard}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
              >
                📷 Normal Flow: Scan Prompt
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-gray-100 rounded text-xs">
              <strong>Debug Info:</strong><br/>
              Screen: {currentScreen}<br/>
              Prompt: {prompt ? 'Set' : 'None'}<br/>
              Cards: {userCards.length}<br/>
              Scanned: {scannedAnswers.length}<br/>
              Bid: {bidAmount}<br/>
              Reveal Index: {revealIndex}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Setup Screen
  if (currentScreen === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">Setup Game</h2>
            
            <div className="mb-4">
              <p className="text-sm mb-2">Prompt: {prompt?.label}</p>
              <p className="text-sm mb-4">Cards: {userCards.join(', ')}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Bid Amount:</label>
              <input
                type="number"
                min="1"
                max="5"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            
            <button
              onClick={() => {
                console.log('Continue button clicked');
                validateAndContinue();
              }}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
            >
              Continue to Scanning
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Scan Answer Cards
  if (currentScreen === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">Scan Answer Cards</h2>
            
            <div className="mb-4">
              <p className="text-sm">Scan {bidAmount} cards in ranking order</p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              {isScanning ? (
                <div>
                  <Scan size={64} className="mx-auto mb-4 text-purple-500 animate-spin" />
                  <p className="text-purple-600">Scanning...</p>
                </div>
              ) : (
                <>
                  <Scan size={64} className="mx-auto mb-4 text-gray-400" />
                  <button
                    onClick={scanAnswerCards}
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
                  >
                    📷 Scan {bidAmount} Cards
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reveal Screen
  if (currentScreen === 4) {
    console.log('Rendering reveal screen...');
    console.log('Scanned answers:', scannedAnswers);
    console.log('Reveal index:', revealIndex);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">Reveal Phase</h2>
            
            <div className="mb-4 p-2 bg-yellow-100 rounded text-xs">
              <strong>Debug:</strong> {scannedAnswers.length} cards scanned, revealing index {revealIndex}
            </div>
            
            {scannedAnswers.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-red-600">❌ No scanned answers found!</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {scannedAnswers.map((cardId, index) => {
                    const isCurrent = index === revealIndex;
                    const isRevealed = index <= revealIndex;
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          isCurrent ? 'border-yellow-400 bg-yellow-50' : 
                          isRevealed ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Position {index + 1}</div>
                            <div className="text-sm text-gray-600">
                              {isRevealed ? (
                                <>Scanned: {countries[cardId]} ({cardId})</>
                              ) : (
                                <>Card {index + 1}: ???</>
                              )}
                            </div>
                          </div>
                          {isRevealed && index < revealIndex && (
                            <CheckCircle className="text-green-500" size={24} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {revealIndex < scannedAnswers.length ? (
                  <button
                    onClick={revealNext}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
                  >
                    Reveal Next Card ({revealIndex + 1}/{scannedAnswers.length})
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentScreen(5)}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
                  >
                    🎯 See Score for Round
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (currentScreen === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="text-center mb-6">
              <Trophy className="mx-auto mb-4 text-yellow-500" size={64} />
              <h2 className="text-2xl font-bold">
                {gameResult?.success ? '🎉 Success!' : '💥 Failed!'}
              </h2>
              <p className="text-gray-600 mt-2">{gameResult?.message}</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Bidder:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {gameResult?.bidderScore}
                  </span>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Blockers:</span>
                  <span className="text-2xl font-bold text-red-600">
                    {gameResult?.blockerScore}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={newGame}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
