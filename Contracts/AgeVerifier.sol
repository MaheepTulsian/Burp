// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract AgeVerifier is Ownable, ReentrancyGuard, Pausable {

    address public selfVerifierAddress;
    address public mockVerifierAddress;
    bool public useMockVerifier;
    uint256 public constant MIN_AGE = 18;

    struct VerificationRecord {
        bool verified;
        uint256 verifiedAt;
        uint256 attestationId;
        bool revoked;
        uint256 revokedAt;
    }

    mapping(address => VerificationRecord) public verifications;
    uint256 public totalVerifiedUsers;

    event UserVerified(address indexed user, uint256 indexed attestationId, uint256 timestamp);
    event VerificationRevoked(address indexed user, address indexed revokedBy, uint256 timestamp);
    event VerifierAddressUpdated(address indexed oldAddress, address indexed newAddress, bool isMock);
    event MockVerifierToggled(bool useMock);

    modifier onlyVerifiedAdult() {
        require(isVerified(msg.sender), "Age verification required");
        _;
    }

    modifier onlyUnverified() {
        require(!verifications[msg.sender].verified, "User already verified");
        _;
    }

    constructor(address _selfVerifierAddress, address _mockVerifierAddress) {
        selfVerifierAddress = _selfVerifierAddress;
        mockVerifierAddress = _mockVerifierAddress;
        useMockVerifier = true;
    }

    function verifyAge(
        uint256 attestationId,
        uint256[8] calldata proof,
        uint256[] calldata pubSignals
    ) external nonReentrant whenNotPaused onlyUnverified {
        require(attestationId > 0, "Invalid attestation ID");
        require(proof.length == 8, "Invalid proof format");
        require(pubSignals.length > 0, "Invalid public signals");

        address verifierToUse = useMockVerifier ? mockVerifierAddress : selfVerifierAddress;
        require(verifierToUse != address(0), "Verifier not configured");

        bool isValidProof;

        if (useMockVerifier) {
            isValidProof = _mockVerifyAge(attestationId, proof, pubSignals);
        } else {
            isValidProof = _callSelfVerifier(verifierToUse, proof, pubSignals);
        }

        require(isValidProof, "Invalid age verification proof");

        verifications[msg.sender] = VerificationRecord({
            verified: true,
            verifiedAt: block.timestamp,
            attestationId: attestationId,
            revoked: false,
            revokedAt: 0
        });

        totalVerifiedUsers++;
        emit UserVerified(msg.sender, attestationId, block.timestamp);
    }

    function isVerified(address user) public view returns (bool) {
        VerificationRecord memory record = verifications[user];
        return record.verified && !record.revoked;
    }

    function getVerificationStatus(address user) external view returns (bool verified, uint256 timestamp) {
        VerificationRecord memory record = verifications[user];
        return (record.verified && !record.revoked, record.verifiedAt);
    }

    function getVerificationRecord(address user) external view returns (VerificationRecord memory) {
        return verifications[user];
    }

    function revokeVerification(address user) external onlyOwner {
        require(verifications[user].verified, "User not verified");
        require(!verifications[user].revoked, "Already revoked");

        verifications[user].revoked = true;
        verifications[user].revokedAt = block.timestamp;
        totalVerifiedUsers--;

        emit VerificationRevoked(user, msg.sender, block.timestamp);
    }

    function setSelfVerifierAddress(address _newVerifierAddress) external onlyOwner {
        require(_newVerifierAddress != address(0), "Invalid address");
        address oldAddress = selfVerifierAddress;
        selfVerifierAddress = _newVerifierAddress;
        emit VerifierAddressUpdated(oldAddress, _newVerifierAddress, false);
    }

    function setMockVerifierAddress(address _newMockAddress) external onlyOwner {
        require(_newMockAddress != address(0), "Invalid address");
        address oldAddress = mockVerifierAddress;
        mockVerifierAddress = _newMockAddress;
        emit VerifierAddressUpdated(oldAddress, _newMockAddress, true);
    }

    function setUseMockVerifier(bool _useMock) external onlyOwner {
        useMockVerifier = _useMock;
        emit MockVerifierToggled(_useMock);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // ============ INTEGRATION HELPERS ============

    /**
     * @notice Batch check verification status for multiple users
     * @param users Array of addresses to check
     * @return verified Array of verification statuses
     */
    function batchCheckVerification(address[] calldata users)
        external
        view
        returns (bool[] memory verified)
    {
        verified = new bool[](users.length);
        for (uint256 i = 0; i < users.length; i++) {
            verified[i] = isVerified(users[i]);
        }
    }

    /**
     * @notice Get verification statistics
     * @return total Total verified users
     * @return active Currently active (non-revoked) verifications
     */
    function getVerificationStats()
        external
        view
        returns (uint256 total, uint256 active)
    {
        return (totalVerifiedUsers, totalVerifiedUsers);
    }

    // ============ DEMO/TESTING FUNCTIONS ============

    /**
     * @notice Access adult content (demo function for testing)
     * @return message Confirmation message for verified adults
     */
    function accessAdultContent()
        external
        view
        onlyVerifiedAdult
        returns (string memory message)
    {
        return "Welcome! You have been verified as 18+ and can access investment products.";
    }

    // ============ INTERNAL FUNCTIONS ============

    /**
     * @notice Mock verification for testing purposes
     * @param attestationId Attestation identifier
     * @param proof ZKP proof (ignored in mock)
     * @param pubSignals Public signals (ignored in mock)
     * @return bool Always returns true for testing
     */
    function _mockVerifyAge(
        uint256 attestationId,
        uint256[8] calldata proof,
        uint256[] calldata pubSignals
    ) internal pure returns (bool) {
        // Simple mock verification - in real testing you might want more sophisticated logic
        return attestationId > 0 && proof.length == 8 && pubSignals.length > 0;
    }

    /**
     * @notice Call Self's verifier contract for production verification
     * @param verifier Self verifier contract address
     * @param proof ZKP proof array
     * @param pubSignals Public signals from verification
     * @return bool Whether proof is valid
     */
    function _callSelfVerifier(
        address verifier,
        uint256[8] calldata proof,
        uint256[] calldata pubSignals
    ) internal returns (bool) {
        // Call Self's verifier contract
        // This would be the actual integration with Self Protocol
        // Format may vary based on Self's specific interface

        (bool success, bytes memory result) = verifier.call(
            abi.encodeWithSignature(
                "verifyProof(uint256[8],uint256[])",
                proof,
                pubSignals
            )
        );

        require(success, "Verifier call failed");
        return abi.decode(result, (bool));
    }
}

// ============ MOCK VERIFIER FOR TESTING ============

/**
 * @title MockSelfVerifier
 * @dev Mock contract simulating Self's verification for testing
 */
contract MockSelfVerifier {

    /**
     * @notice Mock verification function for testing
     * @param proof ZKP proof array (ignored)
     * @param pubSignals Public signals (ignored)
     * @return bool Always returns true for testing
     */
    function verifyProof(
        uint256[8] calldata proof,
        uint256[] calldata pubSignals
    ) external pure returns (bool) {
        // Mock implementation - always returns true for testing
        return proof.length == 8 && pubSignals.length > 0;
    }
}